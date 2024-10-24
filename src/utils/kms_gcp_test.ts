import { GCPKMSService } from "./kmsGcp";

const testMessage = "hello world";

async function test() {
	let gcpKmsService = new GCPKMSService();
	let encryptPrivateKey = await gcpKmsService.encryptMessage(testMessage);
	console.log("encrypt private key:", encryptPrivateKey);

	let decrypt = await gcpKmsService.decryptMessage(encryptPrivateKey);
	console.log("result: ", decrypt == testMessage)
}


test().then()