import { request, gql } from 'graphql-request'

export const calculateUSDValue = async(value: number | string | any, tokenPair: string | null) => {

	const wethPriceQuery = gql`
{
	bundle(id: "1" ) {
	 ethPrice
 }
}
`
	const priceQuery = gql`
{
	bundle(id: "1" ) {
	 ethPrice
   }
   pair(id: "${tokenPair}"){
	   token0 {
		 derivedETH
	   }
   }
  }
`
 	let amount = 0

	// const client = createClient({
	// 	url: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
	// })

	async function fetchWethPrice() {
		const data = await request('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', wethPriceQuery)
		// console.log('urqll' , data)
		amount = data.bundle.ethPrice * value
	}

	async function fetchTokenPrice() {
		// const data = await client.query(priceQuery).toPromise()
		const data = await request('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', priceQuery)
		// console.log('urqlll' , data)
		amount = (data?.pair?.token0! ? data.pair.token0.derivedETH : 0) * data.bundle.ethPrice * value
	}

	if(tokenPair === '0x0') {
		await fetchWethPrice()
	} else if(tokenPair !== undefined) {
		await fetchTokenPrice()
	}

	// console.log('succ', amount, tokenPair)
	return amount
}