import { aiInsightService } from './ai-insight.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getInsight(req, res) {
    try {
        const { assets, investorType, userId } = req.query
        const assetList = assets ? assets.split(',') : []

        const result = await aiInsightService.getDailtInsight(assetList, investorType, userId)        
        res.json(result)
    } catch (err) {
        loggerService.error('Failed to generate AI insight', err)
        res.status(500).send({ err: 'Failed to generate AI insight' })
    }
}
