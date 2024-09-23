
import * as anchor from "@coral-xyz/anchor";
import base from "../config/base";
import {Client} from "mirrorworld-sonic-bridge";
import {PublicKey} from "@solana/web3.js";
import {logger} from "./logger";
import {processSolanaBridgeEvent, processSonicBridgeEvent} from "../services/BridgeService";

const solanaConnection = new anchor.web3.Connection(base.bridge.solana_rpc);
const sonicConnection = new anchor.web3.Connection(base.bridge.sonic_rpc);

const solanaProvider = new anchor.AnchorProvider(solanaConnection, null, anchor.AnchorProvider.defaultOptions());
const sonicProvider = new anchor.AnchorProvider(sonicConnection, null, anchor.AnchorProvider.defaultOptions());

const solanaBridgeClient = new Client(
	solanaProvider,
	base.bridge.solana_network
);

const sonicBridgeClient = new Client(
	sonicProvider,
	base.bridge.sonic_network
);
export async function initBridgeClient() {
	sonicBridgeClient.createTokenMessengerMinterListener("DepositForLock", sonicDepositForLockEvent);
	solanaBridgeClient.createTokenMessengerMinterListener("DepositForLock", solanaDepositForLockEvent);
}

const sonicDepositForLockEvent = (event: any, slot: number, signature: string) => {
	logger.info("receive sonic chain bridge message, signature:", signature, " event data:", event)
	setImmediate(processSonicBridgeEvent, event, signature)
}

const solanaDepositForLockEvent = (event: any, slot: number, signature: string) => {
	logger.info("receive solana chain bridge message, signature:", signature, " event data:", event)
	setImmediate(processSolanaBridgeEvent, event, signature)
}



export async function readMessage(
	chain: string,
	wallet: PublicKey
) {
	try {
		let bridge = chain.includes("sonic") ? sonicBridgeClient : solanaBridgeClient;
		
		let message = await bridge.readMessageSentAccount(wallet);
		
		return message.message
		
	} catch (e) {
		console.error("read message error: ", e);
		return null
	}
}

// return base58 string
export async function signMessage(
	chain: string,
	message: string,
	secretKey: string
) {
	try {
		let bridge = chain.includes("sonic") ? sonicBridgeClient : solanaBridgeClient;
		
		let data = await bridge.signMessage(message, secretKey);
		
		return data
		
	} catch (e) {
		console.error("sign message error: ", e);
		return null
	}
}

