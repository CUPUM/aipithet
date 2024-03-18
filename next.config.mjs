/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	webpack: (config) => {
		// https://lucia-auth.com/getting-started/nextjs-app
		config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');
		return config;
	},
};

export default nextConfig;
