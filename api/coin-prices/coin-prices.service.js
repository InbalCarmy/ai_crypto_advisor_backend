import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'

export const pricesService = {
    getPrices,
    getPricesFromApi
}

const FALLBACK_COINS = [
  { id: "bitcoin", name: "Bitcoin", price: 42100, change24h: 1.25 },
  { id: "ethereum", name: "Ethereum", price: 2300, change24h: -0.40 },
  { id: "cardano", name: "Cardano", price: 0.55, change24h: 2.10 },
  { id: "solana", name: "Solana", price: 98.2, change24h: -1.35 },
  { id: "ripple", name: "Ripple", price: 0.62, change24h: 0.75 },
  { id: "polygon", name: "Polygon", price: 0.89, change24h: 1.05 },
];

async function getPricesFromApi(assets = 'bitcoin,ethereum') {
    try {
        console.log("Fetching prices for assets:", assets);

        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${assets}&vs_currencies=usd&include_24hr_change=true`,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        )

        if (!response.ok) {
            console.log('CoinGecko API error, using fallback data')
            return getFallbackPrices(assets)
        }

        const data = await response.json()
        return data
    } catch (err) {
        console.error('Error fetching coin prices:', err)
        console.log('Using fallback price data')
        return getFallbackPrices(assets)
    }
}

function getFallbackPrices(assets) {
    const requestedAssets = assets.split(',')
    const fallbackData = {}

    requestedAssets.forEach(asset => {
        const coin = FALLBACK_COINS.find(c => c.id === asset.trim())
        if (coin) {
            fallbackData[coin.id] = {
                usd: coin.price,
                usd_24h_change: coin.change24h
            }
        }
    })

    return fallbackData
}

async function getPrices(userId, assets) {
    try {
        const collection = await dbService.getCollection('coinPrice')

        // Get today's date at midnight (to match all prices from today)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Find prices for this user from today
        const cachedPrices = await collection.findOne({
            userId: userId,
            date: { $gte: today },
            assets: assets
        })

        if (cachedPrices) {
            loggerService.info(`Returning cached prices for user ${userId}`)
            return cachedPrices.prices
        }

        // If no cached prices, fetch from API
        loggerService.info(`No cached prices found, fetching from API for user ${userId}`)
        const prices = await getPricesFromApi(assets)

        // Save to database
        await collection.insertOne({
            userId: userId,
            assets: assets,
            prices: prices,
            date: new Date()
        })

        return prices
    } catch (err) {
        loggerService.error('Error getting prices from DB', err)
        return await getPricesFromApi(assets)
    }
}