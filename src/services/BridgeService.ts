import base from "../config/base";
import {readMessage, signMessage} from "../utils/bridge";
import {PublicKey} from "@solana/web3.js";
import {SecretKeyService} from "./SecretKeyService";
import * as base58 from "bs58";
import {sendMessage} from "../utils/queue";
import {logger} from "../utils/logger";

const crypto = require("crypto");

export async function processDepositForLockEvent(
	isSonic: boolean,
	event: any,
	signature: string,
) {
	const fromChainNetwork = isSonic ? base.bridge.sonic_network : base.bridge.solana_network;
	const toChainNetwork = isSonic ? base.bridge.solana_network : base.bridge.sonic_network;
	let amount = event["amount"].toNumber();
	let token = event["lockToken"].toString();
	let wallet = event["depositor"].toString();
	let destination = event["destinationDomain"]
	let messageSentAccount = event["eventAccount"].toString();
	let nonce = event["nonce"].toString();
	const key = `${fromChainNetwork}_${toChainNetwork}_${wallet}_${messageSentAccount}`;
	let message_id = crypto.createHash("sha256").update(key).digest("hex");
	
	// step 2、read and sign message
	let message = await readMessage(fromChainNetwork, new PublicKey(messageSentAccount as string));
	if (!message) {
		return
	}
	
	let messageHex = message.toString("hex");
	let secretKey = await SecretKeyService.getSecretKey();
	let signedMessage = await signMessage(fromChainNetwork, messageHex, secretKey);
	if (!signedMessage) {
		return
	}
	
	let data = {
		message_id: message_id,
		nonce: nonce,
		signer: await SecretKeyService.getSigner(),
		message: messageHex,
		signed_message: base58.encode(signedMessage),
		signature: signature,
		from_chain: fromChainNetwork,
		to_chain: toChainNetwork,
		token: token,
		amount: amount,
		wallet: wallet,
	}

	// step 3、send message
	await sendMessage(
		base.sns.topic,
		base.sns.group,
		`${base.sns.group}_${message_id}`,
		data
	)
}

export async function processSonicBridgeEvent(
	event: any,
	signature: string,
) {
	
	try {
		await processDepositForLockEvent(
			true,
			event,
			signature
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
		await processDepositForLockEvent(
			false,
			event,
			signature
		)
	} catch (e) {
		logger.error("process solana event error:", e)
	}
}
