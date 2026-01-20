import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'

export const feedbackService = {
    addFeedback,
    query
}

async function addFeedback(feedbackData) {
    try {
        const collection = await dbService.getCollection('feedback')

        let query = {
            userId: feedbackData.userId,
            sectionType: feedbackData.sectionType
        }

        //not all feedbacks have contentId so add specific identifier based on section type
        if (feedbackData.sectionType === 'coinPrices') {
            query.contentId = feedbackData.contentId
        } else if (feedbackData.sectionType === 'cryptoMeme') {
            query['metadata.meme'] = feedbackData.metadata?.meme
        } else if (feedbackData.sectionType === 'aiInsight') {
            query['metadata.aiInsight'] = feedbackData.metadata?.aiInsight
        } else if (feedbackData.sectionType === 'marketNews') {
            query['metadata.articleTitle'] = feedbackData.metadata?.articleTitle
        }

        //if user already voted on this content
        const existingVote = await collection.findOne(query)

        //if vote is null, remove the vote
        if (feedbackData.vote === null) {
            if (existingVote) {
                await collection.deleteOne({ _id: existingVote._id })
                loggerService.info(`Vote removed for user ${feedbackData.userId}`)
                return { message: 'Vote removed successfully' }
            }
            return
        }

        //if vote exist, update the vote
        if (existingVote) {
            const updatedFeedback = {
                ...existingVote,
                vote: feedbackData.vote,
                timestamp: new Date(feedbackData.timestamp)
            }
            await collection.updateOne(
                { _id: existingVote._id },
                { $set: updatedFeedback }
            )
            loggerService.info(`Vote updated for user ${feedbackData.userId}`)
            return updatedFeedback
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

        const result = await collection.insertOne(feedback)
        loggerService.info(`New vote added: ${result.insertedId}`)

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