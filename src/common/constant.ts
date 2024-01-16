import { BlockchainNetwork } from "@dfns/sdk/codegen/datamodel/Wallets";

export const ethereumRecIdOffset = 27;
export const coingeckoApiUrl = "https://api.coingecko.com/api/v3/";

type NetworkInfo = {
	[network in BlockchainNetwork]:
		| {
				chainId: string;
				chainName: string;
				nativeCurrency: {
					name: string;
					symbol: string;
					decimals: number;
				};
				rpcUrls: string[];
				blockExplorerUrls: string[];
		  }
		| undefined;
};

export const networkInfo: NetworkInfo = {
	[BlockchainNetwork.Polygon]: {
		chainId: "0x89",
		chainName: "Polygon",
		nativeCurrency: {
			name: "MATIC",
			symbol: "MATIC",
			decimals: 18,
		},
		rpcUrls: ["https://polygon.llamarpc.com"],
		blockExplorerUrls: ["https://polygonscan.com/"],
	},
	[BlockchainNetwork.PolygonMumbai]: {
		chainId: "0x13881",
		chainName: "Mumbai",
		nativeCurrency: {
			name: "MATIC",
			symbol: "MATIC",
			decimals: 18,
		},
		rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
		blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
	},
	[BlockchainNetwork.Ethereum]: {
		chainId: "0x1",
		chainName: "Ethereum",
		nativeCurrency: {
			name: "Ether",
			symbol: "ETH",
			decimals: 18,
		},
		rpcUrls: ["https://eth.llamarpc.com"],
		blockExplorerUrls: ["https://etherscan.io/"],
	},
	[BlockchainNetwork.EthereumSepolia]: {
		chainId: "0xaa36a7",
		chainName: "Sepolia",
		nativeCurrency: {
			name: "Ether",
			symbol: "ETH",
			decimals: 18,
		},
		rpcUrls: ["https://endpoints.omniatech.io/v1/eth/sepolia/public"],
		blockExplorerUrls: ["https://sepolia.etherscan.io/"],
	},
	[BlockchainNetwork.EthereumGoerli]: {
		chainId: "0x5",
		chainName: "Goerli",
		nativeCurrency: {
			name: "Ether",
			symbol: "ETH",
			decimals: 18,
		},
		rpcUrls: ["https://ethereum-goerli.publicnode.com"],
		blockExplorerUrls: ["https://goerli.etherscan.io/"],
	},
	[BlockchainNetwork.ArbitrumOne]: {
		chainId: "0xa4b1",
		chainName: "Arbitrum",
		nativeCurrency: {
			name: "Arbitrum",
			symbol: "ARB",
			decimals: 18,
		},
		rpcUrls: ["https://arbitrum.llamarpc.com"],
		blockExplorerUrls: ["https://arbiscan.io/"],
	},
	[BlockchainNetwork.Bsc]: {
		chainId: "0x38",
		chainName: "Binance Smart Chain",
		nativeCurrency: {
			name: "BNB",
			symbol: "BNB",
			decimals: 18,
		},
		rpcUrls: ["https://binance.llamarpc.com"],
		blockExplorerUrls: ["https://bscscan.com/"],
	},
	[BlockchainNetwork.BscTestnet]: {
		chainId: "0x61",
		chainName: "Binance Smart Chain Testnet",
		nativeCurrency: {
			name: "Testnet BNB",
			symbol: "tBNB",
			decimals: 18,
		},
		rpcUrls: ["https://bsc-testnet.publicnode.com"],
		blockExplorerUrls: ["https://testnet.bscscan.com/"],
	},
	[BlockchainNetwork.ArbitrumGoerli]: undefined,
	[BlockchainNetwork.AvalancheC]: undefined,
	[BlockchainNetwork.AvalancheCFuji]: undefined,
	[BlockchainNetwork.Bitcoin]: undefined,
	[BlockchainNetwork.BitcoinTestnet3]: undefined,
	[BlockchainNetwork.FantomOpera]: undefined,
	[BlockchainNetwork.FantomTestnet]: undefined,
	[BlockchainNetwork.Optimism]: undefined,
	[BlockchainNetwork.OptimismGoerli]: undefined,
	[BlockchainNetwork.Ripple]: undefined,
	[BlockchainNetwork.RippleTestnet]: undefined,
	[BlockchainNetwork.Solana]: undefined,
	[BlockchainNetwork.SolanaDevnet]: undefined,
	[BlockchainNetwork.Tron]: undefined,
	[BlockchainNetwork.TronNile]: undefined,
	[BlockchainNetwork.KeyECDSA]: undefined,
	[BlockchainNetwork.KeyEdDSA]: undefined,
	[BlockchainNetwork.ArbitrumSepolia]: undefined,
	[BlockchainNetwork.Base]: undefined,
	[BlockchainNetwork.BaseGoerli]: undefined,
	[BlockchainNetwork.Tezos]: undefined,
	[BlockchainNetwork.TezosGhostnet]: undefined,
	[BlockchainNetwork.KeyECDSAStark]: undefined,
};
export const binanceApiUrl = "https://api.binance.com";
