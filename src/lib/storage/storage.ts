import { Storage } from '@google-cloud/storage';

export const storage = new Storage({
	projectId: process.env.STORAGE_PROJECT_ID,
	credentials: {
		private_key: process.env.STORAGE_PRIVATE_KEY,
		client_email: process.env.STORAGE_CLIENT_EMAIL,
	},
});
