/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'storage.googleapis.com',
				port: '',
			},
		],
	},
	webpack: (config) => {
		// https://lucia-auth.com/getting-started/nextjs-app
		config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');
		return config;
	},
};

export default nextConfig;
