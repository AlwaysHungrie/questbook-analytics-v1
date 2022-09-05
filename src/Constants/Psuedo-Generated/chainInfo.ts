import chainInfo from './chainInfo.json'

interface ChainInfo {
	readonly id: number
	readonly name: string
	readonly isTestNetwork?: boolean
	readonly icon: string
	readonly wallets: string[],
	readonly explorer: {
		address: string
		transactionHash: string
	}
	readonly supportedCurrencies: {
		[address: string]: {
			icon: string
			label: string
			pair?: string
			address: string
			decimals: number
		}
	}
	readonly subgraphClientUrl: string
	readonly rpcUrls: string[]
	readonly nativeCurrency: {
		name: string
		symbol: string
		decimals: number
	}
}

type ChainInfoMap = { readonly [chainId in number]: ChainInfo }

export const CHAIN_INFO = chainInfo as ChainInfoMap