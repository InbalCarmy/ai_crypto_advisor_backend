import express from 'express'
import { getPrices } from './coin-prices.controller.js'

const router = express.Router()

router.get('/', getPrices)

export const coinPricesRoutes = router
