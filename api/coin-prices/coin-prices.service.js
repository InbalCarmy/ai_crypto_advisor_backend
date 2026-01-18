export const pricesService = {
    getPrices
}

async function getPrices(assets = 'bitcoin,ethereum') {
    try {
        console.log("Fetching prices for assets:", assets);

        // CoinGecko API endpoint
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${assets}&vs_currencies=usd&include_24hr_change=true`,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        )

        if (!response.ok) {
            throw new Error(`CoinGecko API Error: ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (err) {
        console.error('Error fetching coin prices:', err)
        throw err
    }
}