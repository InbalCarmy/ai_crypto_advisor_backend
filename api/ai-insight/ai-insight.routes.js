import express from 'express'
import { getInsight } from './ai-insight.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', requireAuth, getInsight)

export const aiInsightRoutes = router
