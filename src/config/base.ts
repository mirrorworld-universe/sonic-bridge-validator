require("dotenv").config();

const base = {
	kms: {
		provider: process.env.KMS_PROVIDER,
		aws: {
			key_id: process.env.KMS_AWS_KEY_ID,
			region: process.env.KMS_AWS_REGION,
			access_key_id: process.env.KMS_AWS_ACCESS_KEY_ID,
			secret_access_key: process.env.KMS_AWS_SECRET_ACCESS_KEY
		},
		gcp: {
			project_id: process.env.KMS_GCP_PROJECT_ID,
			location_id: process.env.KMS_GCP_LOCATION_ID,
			keyring_id: process.env.KMS_GCP_KEYRING_ID,
			key_id: process.env.KMS_GCP_KEY_ID,
		}
	},
	wallet: {
		private_key: process.env.WALLET_PRIVATE_KEY,
	},
	aws: {
		access_key_id: process.env.AWS_ACCESS_KEY_ID,
		secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
		region: process.env.AWS_REGION,
	},
	sns: {
		topic: process.env.SNS_TOPIC,
		group: process.env.SNS_GROUP,
	},
	bridge: {
		sonic_network: process.env.SONIC_NETWORK,
		sonic_rpc: process.env.SONIC_RPC,
		solana_network: process.env.SOLANA_NETWORK,
		solana_rpc: process.env.SOLANA_RPC
	}
}

export default base;