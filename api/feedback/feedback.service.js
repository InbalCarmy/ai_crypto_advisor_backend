import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'

export const feedbackService = {
    addFeedback,
    query
}

async function addFeedback(feedbackData) {
    try {
        const collection = await dbService.getCollection('feedback')

        // Simple query: just userId and sectionType
        const query = {
            userId: feedbackData.userId,
            sectionType: feedbackData.sectionType
        }

        // Check if user already voted on this section
        const existingVote = await collection.findOne(query)

        // If vote is null, remove the vote
        if (feedbackData.vote === null) {
            if (existingVote) {
                await collection.deleteOne({ _id: existingVote._id })
                loggerService.info(`Vote removed for user ${feedbackData.userId} on section ${feedbackData.sectionType}`)
                return { message: 'Vote removed successfully' }
            }
            return { message: 'No vote to remove' }
        }

        // If vote exists, update it
        if (existingVote) {
            const updatedFeedback = {
                vote: feedbackData.vote,
                timestamp: new Date()
            }
            await collection.updateOne(
                { _id: existingVote._id },
                { $set: updatedFeedback }
            )
            loggerService.info(`Vote updated for user ${feedbackData.userId} on section ${feedbackData.sectionType}`)
            return { ...existingVote, ...updatedFeedback }
        }

        // Create a new vote
        const feedback = {
            userId: feedbackData.userId,
            sectionType: feedbackData.sectionType,
            vote: feedbackData.vote,
            timestamp: new Date()
        }

        const result = await collection.insertOne(feedback)
        loggerService.info(`New vote added: ${result.insertedId} for section ${feedbackData.sectionType}`)

        const createdFeedback = { ...feedback, _id: result.insertedId }
        return createdFeedback
    } catch (err) {
        loggerService.error('Cannot add feedback', err)
        throw err
    }
}

export async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection("feedback")

    const feedbacks = await collection.find(criteria).toArray()
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