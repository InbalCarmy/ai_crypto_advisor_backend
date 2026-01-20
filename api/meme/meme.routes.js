import express from 'express'
import { getMeme } from './meme.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', requireAuth, getMeme)

export const memeRoutes = router
