import express from 'express'
import { getNews } from './news.controller.js'

const router = express.Router()

router.get('/', getNews)

export const newsRoutes = router
