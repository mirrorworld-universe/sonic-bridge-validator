import {DecryptCommand, EncryptCommand, KMSClient} from "@aws-sdk/client-kms";
import base from "../config/base";

const accessKeyId = base.kms.access_key_id;
const secretAccessKey = base.kms.secret_access_key;

const kmsClient = new KMSClient({
	region: base.kms.region,
	credentials: {
		accessKeyId,
		secretAccessKey,
	}
})

export async function encryptMessage(message: any): Promise<string> {
	
	const encryptParams = {
		KeyId: base.kms.key_id,
		Plaintext: Buffer.from(JSON.stringify(message))
	};
	
	const command = new EncryptCommand(encryptParams);
	const encryptBlob = await kmsClient.send(command);
	// @ts-ignore
	const encryptBase64 = Buffer.from(encryptBlob.CiphertextBlob).toString("base64")
	return encryptBase64
}

export async function decryptMessage(message: string): Promise<string> {
	const blob = Uint8Array.from(Buffer.from(message, "base64"));
	const command = new DecryptCommand({
		KeyId: base.kms.key_id,
		CiphertextBlob: blob
	});
	const decryptBinaryData = await kmsClient.send(command);
	let decryptData = String.fromCharCode.apply(null, new Uint16Array(decryptBinaryData.Plaintext));
	if (decryptData[0] == '"') {
		decryptData = decryptData.slice(1);
	}
	if (decryptData[decryptData.length - 1] == '"') {
		decryptData = decryptData.slice(0, decryptData.length - 1);
	}
	return decryptData
}