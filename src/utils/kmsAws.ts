import type { IKMSService } from './kms';

import { DecryptCommand, EncryptCommand, KMSClient } from "@aws-sdk/client-kms";
import base from "../config/base";

export class AWSKMSService implements IKMSService {
	private kmsClient: KMSClient;

	constructor() {
		this.kmsClient = new KMSClient({
			region: base.kms.aws.region,
			credentials: {
				accessKeyId: base.kms.aws.access_key_id,
				secretAccessKey: base.kms.aws.secret_access_key,
			},
		});
	}

	async encryptMessage(message: any): Promise<string> {
		const encryptParams = {
			KeyId: base.kms.aws.key_id,
			Plaintext: Buffer.from(JSON.stringify(message)),
		};
		const command = new EncryptCommand(encryptParams);
		const encryptBlob = await this.kmsClient.send(command);
		// @ts-ignore
		const encryptBase64 = Buffer.from(encryptBlob.CiphertextBlob).toString("base64");
		return encryptBase64;
	}

	async decryptMessage(message: string): Promise<string> {
		const blob = Uint8Array.from(Buffer.from(message, "base64"));
		const command = new DecryptCommand({
			KeyId: base.kms.aws.key_id,
			CiphertextBlob: blob,
		});
		const decryptBinaryData = await this.kmsClient.send(command);
		let decryptData = String.fromCharCode.apply(null, new Uint16Array(decryptBinaryData.Plaintext));
		if (decryptData[0] == '"') {
			decryptData = decryptData.slice(1);
		}
		if (decryptData[decryptData.length - 1] == '"') {
			decryptData = decryptData.slice(0, decryptData.length - 1);
		}
		return decryptData;
	}
}
