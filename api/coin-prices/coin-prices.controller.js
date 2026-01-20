
import { pricesService } from './coin-prices.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getPrices(req, res) {
    try {
        const { assets, userId } = req.query
        const prices = await pricesService.getPrices(userId, assets)
        res.json(prices)
    } catch (err) {
        loggerService.error('Failed to get coin prices', err)
        res.status(500).send({ err: 'Failed to get coin prices' })
    }
}
