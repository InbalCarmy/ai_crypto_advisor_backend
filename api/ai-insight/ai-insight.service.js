import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'

export const aiInsightService = {
    generateInsight,
    getDailtInsight
}

async function generateInsight(assets = [], investorType = 'General') {
    try {
        const assetsText = assets.length > 0
            ? assets.join(', ')
            : 'Bitcoin, Ethereum'

        const prompt = `You are a crypto investment advisor AI. Generate a single, concise insight (2-3 sentences max) for a ${investorType} investor interested in ${assetsText}.

The insight should be:
- Actionable and specific
- Based on current market trends
- Educational but not financial advice
- Encouraging but realistic

Just provide the insight text, nothing else.`

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile', 
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 150
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            console.error('Groq API Error:', errorData)
            throw new Error(`Groq API Error: ${response.status}`)
        }

        const data = await response.json()        
        const insight = data.choices[0].message.content.trim()

        return { insight }
    } catch (err) {
        console.error('Error generating insight:', err)
        throw err
    }
}

async function getDailtInsight(assets = [], investorType = 'General', userId){
    try {
        const collection = await dbService.getCollection('aiInsight')

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const cachedInsight = await collection.findOne({
            userId: userId,
            date: { $gte: today },
        })

        if (cachedInsight) {
            loggerService.info(`Returning cached insight for user ${userId}`)
            return cachedInsight.insight
        }

        // If no cached insight, fetch from API
        loggerService.info(`No cached insight found, fetching from API for user ${userId}`)
        const insight = await generateInsight(assets, investorType)

        // Save to database
        await collection.insertOne({
            userId: userId,
            assets: assets,
            investorType: investorType,
            insight: insight,
            date: new Date()
        })

        return prices
    } catch (err) {
        loggerService.error('Error getting insight from DB', err)
        return await generateInsight(assets, investorType)
    }

}
