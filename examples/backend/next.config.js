const nextConfig = {

	async headers() {
		return [{
			source: '/(.*)',
			headers: [
				{
					key: "Permissions-Policy",
					value: "publickey-credentials-get=*"
				},
				{
					key: "Permissions-Policy",
					value: "publickey-credentials-create=*"
				}
			]
		}];
	},
	experimental: {
		appDir: true,
	},

	// reactStrictMode: true,
};

module.exports = nextConfig;
