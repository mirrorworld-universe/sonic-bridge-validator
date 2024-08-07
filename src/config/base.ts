

require("dotenv").config();

const base = {
	kms: {
		key_id: process.env.KMS_KEY_ID,
		region: process.env.KMS_REGION,
		access_key_id: process.env.KMS_AWS_ACCESS_KEY_ID,
		secret_access_key: process.env.KMS_AWS_SECRET_ACCESS_KEY,
	},
	wallet: {
		private_key: process.env.WALLET_PRIVATE_KEY,
	}
}

export default base;