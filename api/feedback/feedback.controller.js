import { loggerService } from '../../services/logger.service.js'
import { feedbackService } from "./feedback.service.js";

export async function getFeedbacks(req, res){
    try{
        const filterBy ={
            sectionType: req.query.sectionType || '',
            userId: req.query.userId || ''
        }
        const feedbacks = await feedbackService.query(filterBy)
        res.json(feedbacks)
    } catch(err) {
        loggerService.error('Failed to get feedbacks', err)
        res.status(400).send({err:'Failed to get feedbacks'})
    }

}

// export async function getFeedbackByUserId(req, res){
//     try {
//         const userId = req.params.userId
//         const feedbacks = await feedbackService.getFeedbackByUser(userId)
//         res.json(feedbacks)
//     } catch(err){
//         loggerService.erre('Faild to get feedback by user id', err)
//         res.status(400).send({err: 'Faild to get feedbacks by user id'})
//     }

// }

export async function addFeedback(req, res){
    const {body : feedbackData} = req
    try {
        const addedFeedback = await feedbackService.addFeedback(feedbackData)
        res.json(addedFeedback)
    } catch (err) {
        loggerService.err('Failed to add feedback', err)
        res.status(400).send({err: 'Faild to add feedback'})
    }
}

// export async function getFeedbackBySectionName(req, res){
//     try {
//         const section = req.params.sectionName
//         const feedbacks = await feedbackService.getFeedbackBySection(section)
//         res.json(feedbacks)
//     } catch(err){
//         loggerService.erre('Faild to get feedback by section name', err)
//         res.status(400).send({err: 'Faild to get feedbacks by section name'})
//     }

// }