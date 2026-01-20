import express from 'express'
import { getPrices } from './coin-prices.controller.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', requireAuth, getPrices)

export const coinPricesRoutes = router
