import express from 'express'
import { getInsight } from './ai-insight.controller.js'

const router = express.Router()

router.get('/', getInsight)

export const aiInsightRoutes = router
