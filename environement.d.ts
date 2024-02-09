/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NodeJS {
	interface ProcessEnv {
		DB_USER: string;
		DB_PASSWORD: string;
		DB_HOST: string;
		DB_HOST_POOLED: string;
		DB_NAME: string;
		DB_PORT: string;
		RESEND_API_KEY: string;
		STORAGE_ACCESS_KEY: string;
		STORAGE_SECRET_KEY: string;
		STORAGE_BUCKET_NAME: string;
		STORAGE_BUCKET_REGION: string;
	}
}
