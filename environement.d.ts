/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NodeJS {
	interface ProcessEnv {
		VERCEL_PROJECT_PRODUCTION_URL: string;
		DB_USER: string;
		DB_PASSWORD: string;
		DB_HOST: string;
		DB_HOST_POOLED: string;
		DB_NAME: string;
		DB_PORT: string;
		EMAIL_HOST: string;
		EMAIL_PORT: string;
		EMAIL_USER: string;
		EMAIL_PASSWORD: string;
		STORAGE_PROJECT_ID: string;
		STORAGE_PRIVATE_KEY: string;
		STORAGE_CLIENT_EMAIL: string;
	}
}
