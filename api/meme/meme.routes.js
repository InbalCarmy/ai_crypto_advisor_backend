import express from 'express'
import { getMeme } from './meme.controller.js'

const router = express.Router()

router.get('/', getMeme)

export const memeRoutes = router
