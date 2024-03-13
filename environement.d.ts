/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NodeJS {
	interface ProcessEnv {
		VERCEL_URL: string;
		DB_USER: string;
		DB_PASSWORD: string;
		DB_HOST: string;
		DB_HOST_POOLED: string;
		DB_NAME: string;
		DB_PORT: string;
		RESEND_DOMAIN: string;
		RESEND_API_KEY: string;
		S3_ACCESS_KEY: string;
		S3_SECRET_KEY: string;
		S3_BUCKET_NAME: string;
		S3_BUCKET_REGION: string;
	}
}
