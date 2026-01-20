
import express from 'express'
import {requireAuth}  from '../../middlewares/requireAuth.middleware.js'
import {  getFeedbacks, addFeedback } from './feedback.controller.js'

const router = express.Router()

router.get('/', requireAuth, getFeedbacks)
router.post('/', requireAuth, addFeedback)

export const feedbackRoutes = router