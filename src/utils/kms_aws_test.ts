import { AWSKMSService } from "./kmsAws";

const testMessage = "hello world";

async function test() {
	let awsKmsService = new AWSKMSService();
	let encryptPrivateKey = await awsKmsService.encryptMessage(testMessage);
	console.log("encrypt private key:", encryptPrivateKey);

	let decrypt = await awsKmsService.decryptMessage(encryptPrivateKey);
	console.log("result: ", decrypt == testMessage)
}


test().then()