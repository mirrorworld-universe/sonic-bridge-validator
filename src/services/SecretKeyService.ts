import { getKMSService } from "../utils/kmsFactory";
import base from "../config/base";
import { PublicKey } from "@solana/web3.js";
import * as ethutil from "ethereumjs-util";
import type { IKMSService } from '../utils/kms';


let secretKey;

class SecretKeyService {
	private kmsService: IKMSService;

	constructor() {
		this.kmsService = getKMSService();
	}

	public async getSecretKey() {

		if (!secretKey) {
			let key = await this.kmsService.decryptMessage(base.wallet.private_key);
			secretKey = key
		}

		return secretKey
	}

	public async getSigner() {
		let key = await this.getSecretKey();

		let publicKey = new PublicKey(
			ethutil.privateToAddress(Buffer.from(key, "hex"))
		)
		return publicKey.toString()
	}

}

const service = new SecretKeyService();
export { service as SecretKeyService }