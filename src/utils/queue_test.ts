import {sendMessage} from "./queue";
import base from "../config/base";


let message = {
	message_id: "test_1",
	data: {
		"foo": "bar"
	}
};

async function testSendMessage() {
	
	await sendMessage(
		base.sns.topic,
		base.sns.group,
		base.sns.group + "_" + "message_2",
		message
	)
	
}

testSendMessage().then()