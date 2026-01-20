import { loggerService } from '../../services/logger.service.js'
import { feedbackService } from "./feedback.service.js";

export async function getFeedbacks(req, res){
    try{
        const filterBy ={
            sectionType: req.query.sectionType || '',
            userId: req.query.userId || '',
            date: req.query.date || ''
        }
        const feedbacks = await feedbackService.query(filterBy)
        res.json(feedbacks)
    } catch(err) {
        loggerService.error('Failed to get feedbacks', err)
        res.status(400).send({err:'Failed to get feedbacks'})
    }

}


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
