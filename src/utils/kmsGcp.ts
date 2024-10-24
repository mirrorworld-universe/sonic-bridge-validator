// services/gcpKmsService.ts
import type { IKMSService } from './kms';

import { KeyManagementServiceClient } from "@google-cloud/kms";
import base from "../config/base";

const crc32c = require('fast-crc32c');

export class GCPKMSService implements IKMSService {
    private client: KeyManagementServiceClient;
    private keyName: string;

    constructor() {
        this.client = new KeyManagementServiceClient();
        this.keyName = this.client.cryptoKeyPath(
            base.kms.gcp.project_id, 
            base.kms.gcp.location_id, 
            base.kms.gcp.keyring_id, 
            base.kms.gcp.key_id
        );
    }

    async encryptMessage(message: any): Promise<string> {
        const plaintextBuffer = Buffer.from(JSON.stringify(message));
        const plaintextCrc32c = crc32c.calculate(plaintextBuffer);
        const [encryptResponse] = await this.client.encrypt({
            name: this.keyName,
            plaintext: plaintextBuffer,
            plaintextCrc32c: {
                value: plaintextCrc32c,
            },
        });

        const ciphertext = encryptResponse.ciphertext;

        if (!encryptResponse.verifiedPlaintextCrc32c) {
            throw new Error('Encrypt: request corrupted in-transit');
        }
        if (
            crc32c.calculate(ciphertext) !==
            Number(encryptResponse.ciphertextCrc32c.value)
        ) {
            throw new Error('Encrypt: response corrupted in-transit');
        }

        if (ciphertext instanceof Uint8Array) {
            return Buffer.from(ciphertext).toString("base64");
        } else if (typeof ciphertext === 'string') {
            return ciphertext;
        } else {
            throw new Error('Unexpected ciphertext format');
        }
    }

    async decryptMessage(message: string): Promise<string> {
        const ciphertext = Buffer.from(message, "base64");
        const ciphertextCrc32c = crc32c.calculate(ciphertext);

        const [decryptResponse] = await this.client.decrypt({
            name: this.keyName,
            ciphertext: ciphertext,
            ciphertextCrc32c: {
                value: ciphertextCrc32c,
            },
        });
        if (
            crc32c.calculate(decryptResponse.plaintext) !==
            Number(decryptResponse.plaintextCrc32c.value)
        ) {
            throw new Error('Decrypt: response corrupted in-transit');
        }

        const plaintextBuffer = Buffer.from(decryptResponse.plaintext as Uint8Array);
        const plaintext = plaintextBuffer.toString();

        return plaintext;
    }
}