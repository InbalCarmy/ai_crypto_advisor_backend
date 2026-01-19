import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'

export const feedbackService = {
    addFeedback,
    query
}

async function addFeedback(feedbackData) {
    try {
        const collection = await dbService.getCollection('feedback')

        //if user already voted on this content
        const existingVote = await collection.findOne({
            userId: feedbackData.userId,
            sectionType: feedbackData.sectionType,
            contentId: feedbackData.contentId
        })

        //if vote is null, remove the vote
        if (feedbackData.vote === null) {
            if (existingVote) {
                await collection.deleteOne({ _id: existingVote._id })
                loggerService.info(`Vote removed for user ${feedbackData.userId}`)
                return { message: 'Vote removed successfully' }
            }
            return { message: 'No vote to remove' }
        }

        //if vote exist, update the vote
        if (existingVote) {
            await collection.updateOne(
                { _id: existingVote._id },
                {
                    $set: {
                        vote: feedbackData.vote,
                        timestamp: new Date(feedbackData.timestamp)
                    }
                }
            )
            loggerService.info(`Vote updated for user ${feedbackData.userId}`)
            return { message: 'Vote updated successfully', _id: existingVote._id }
        }

        //create a new vote
        const feedback = {
            userId: feedbackData.userId,
            sectionType: feedbackData.sectionType,
            contentId: feedbackData.contentId,
            vote: feedbackData.vote,
            metadata: feedbackData.metadata || {},
            timestamp: new Date(feedbackData.timestamp)
        }

        console.log('Saving feedback:', feedback)
        const result = await collection.insertOne(feedback)
        loggerService.info(`New vote added: ${result.insertedId}`)

        return { message: 'Vote added successfully', _id: result.insertedId }
    } catch (err) {
        loggerService.error('Cannot add feedback', err)
        throw err
    }
}

export async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy)
    console.log('Query filterBy:', filterBy)
    console.log('Query criteria:', criteria)
    const collection = await dbService.getCollection("feedback")

    const feedbacks = await collection.find(criteria).toArray()
    console.log('Found feedbacks:', feedbacks.length)
    return feedbacks
  } catch (err) {
    loggerService.error("Cannot get feedback", err)
    throw err
  }
}


function _buildCriteria(filterBy = {}) {
  const criteria = {}

  if (filterBy.userId) {
    criteria.userId = filterBy.userId
  }

  if (filterBy.sectionType) {
    criteria.sectionType = filterBy.sectionType
  }

  return criteria
}