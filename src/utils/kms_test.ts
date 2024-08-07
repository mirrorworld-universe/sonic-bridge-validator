import {decryptMessage, encryptMessage} from "./kms";


const testMessage = "hello world";

async function test() {
	let encryptPrivateKey = await encryptMessage(testMessage);
	console.log("encrypt private key:", encryptPrivateKey);

	let decrypt = await decryptMessage(encryptPrivateKey);
	console.log("result: ", decrypt == testMessage)
}


test().then()