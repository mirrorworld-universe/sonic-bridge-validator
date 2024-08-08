import {PublishCommand, SNSClient} from "@aws-sdk/client-sns";
import base from "../config/base";
import {logger} from "./logger";

const snsClient = new SNSClient({
	region: base.aws.region,
	credentials: {
		accessKeyId: base.aws.access_key_id,
		secretAccessKey: base.aws.secret_access_key,
	}
})


export async function sendMessage(
	topic: string,
	messageGroupId: string,
	messageDeduplicationId: string,
	message: any
) {

	try {
		const params = {
			Message: JSON.stringify(message),
			TopicArn: topic,
			MessageGroupId: messageGroupId,
			MessageDeduplicationId: messageDeduplicationId
		};
		
		let resp = await snsClient.send(
			new PublishCommand(params)
		);
		logger.info("send message success: ", resp)
	
	} catch (e) {
		logger.error("send message error: ", e)
	}
}