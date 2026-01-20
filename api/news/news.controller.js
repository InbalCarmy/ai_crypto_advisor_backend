import { newsService } from './news.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getNews(req, res) {
    try {
        const { currencies, userId } = req.query
        const news = await newsService.getNews(userId, currencies)        
        res.json(news)
    } catch (err) {
        loggerService.error('Failed to get news', err)
        res.status(500).send({ err: 'Failed to get news' })
    }
}
