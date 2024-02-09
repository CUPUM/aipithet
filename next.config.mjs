/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	rewrites() {
		return [
			{
				source: '/:path((?!fr|en).*)',
				destination: '/fr/:path*',
			},
		];
	},
};

export default nextConfig;
