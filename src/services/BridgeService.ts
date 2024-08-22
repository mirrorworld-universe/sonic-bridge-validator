import {Networks} from "mirrorworld-sonic-bridge";
import base from "../config/base";
import {readMessage, signMessage} from "../utils/bridge";
import {PublicKey} from "@solana/web3.js";
import {SecretKeyService} from "./SecretKeyService";
import * as base58 from "bs58";
import {sendMessage} from "../utils/queue";
import {logger} from "../utils/logger";

const crypto = require("crypto");

export async function processSonicBridgeEvent(
	event: any,
	signature: string,
) {
	
	try {
		// step 1、parse data
		let amount = event["amount"].toNumber();
		let token = event["lockToken"].toString();
		let wallet = event["depositor"].toString();
		let destination = event["destinationDomain"]
		let messageSentAccount = event["eventAccount"].toString();
		const key = `${base.bridge.sonic_network}_${base.bridge.solana_network}_${wallet}_${messageSentAccount}`;
		let message_id = crypto.createHash("sha256").update(key).digest("hex");
		
		// step 2、read and sign message
		console.log("message account: ", messageSentAccount)
		let message = await readMessage(base.bridge.sonic_network, new PublicKey(messageSentAccount as string));
		if (!message) {
			return
		}
		
		let messageHex = message.toString("hex");
		let secretKey = await SecretKeyService.getSecretKey();
		let signedMessage = await signMessage(base.bridge.sonic_network, messageHex, secretKey);
		
		let data = {
			message_id: message_id,
			signer: await SecretKeyService.getSigner(),
			message: messageHex,
			signed_message: base58.encode(signedMessage),
			signature: signature,
			from_chain: base.bridge.sonic_network,
			to_chain: base.bridge.solana_network,
			token: token,
			amount: amount,
			wallet: wallet,
		}
		console.log("data:", data);
		// step 3、send message
		await sendMessage(
			base.sns.topic,
			base.sns.group,
			message_id,
			data
		)
	} catch (e) {
		logger.error("process sonic event error:", e)
	}
	
}

export async function processSolanaBridgeEvent(
	event: any,
	signature: string,
) {
	
	try {
		// step 1、parse data
		let amount = event["amount"].toNumber();
		let token = event["lockToken"].toString();
		let wallet = event["depositor"].toString();
		let destination = event["destinationDomain"]
		let messageSentAccount = event["eventAccount"].toString();
		const key = `${base.bridge.solana_network}_${base.bridge.sonic_network}_${wallet}_${messageSentAccount}`;
		let message_id = crypto.createHash("sha256").update(key).digest("hex");
		
		// step 2、read and sign message
		let message = await readMessage(base.bridge.solana_network, new PublicKey(messageSentAccount));
		if (!message) {
			return
		}
		
		let messageHex = message.toString("hex");
		let secretKey = await SecretKeyService.getSecretKey();
		let signedMessage = await signMessage(base.bridge.solana_network, messageHex, secretKey);
		
		let data = {
			message_id: message_id,
			signer: await SecretKeyService.getSigner(),
			message: messageHex,
			signed_message: base58.encode(signedMessage),
			signature: signature,
			from_chain: base.bridge.solana_network,
			to_chain: base.bridge.sonic_network,
			token: token,
			amount: amount,
			wallet: wallet,
		}
		
		// step 3、send message
		await sendMessage(
			base.sns.topic,
			base.sns.group,
			message_id,
			data
		)
	} catch (e) {
		logger.error("process solana event error:", e)
	}
}
