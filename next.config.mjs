import { paraglide } from '@inlang/paraglide-js-adapter-next';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = paraglide({
	webpack: (config) => {
		// https://lucia-auth.com/getting-started/nextjs-app
		config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');
		return config;
	},
	rewrites() {
		return [
			{
				source: '/:path((?!fr|en).*)',
				destination: '/fr/:path*',
			},
		];
	},
	paraglide: {
		project: './project.inlang',
		outdir: './src/lib/i18n/generated',
	},
});

export default nextConfig;
