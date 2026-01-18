import { memeService } from './meme.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getMeme(req, res) {
    try {
        const meme = await memeService.getMeme()
        res.json(meme)
    } catch (err) {
        loggerService.error('Failed to get meme', err)
        res.status(500).send({ err: 'Failed to get meme' })
    }
}
