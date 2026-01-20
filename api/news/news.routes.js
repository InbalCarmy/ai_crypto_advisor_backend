import express from 'express'
import { getNews } from './news.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', requireAuth, getNews)

export const newsRoutes = router
