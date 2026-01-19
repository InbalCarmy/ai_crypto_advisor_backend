
import express from 'express'
import {requireAuth}  from '../../middlewares/requireAuth.middleware.js'
import {  getFeedbacks, addFeedback } from './feedback.controller.js'

const router = express.Router()

router.get('/', getFeedbacks)
// router.get('/:userId', getFeedbackByUserId)
router.post('/' ,addFeedback)
// router.get('/:sectionName', getFeedbackBySectionName)

export const feedbackRoutes = router