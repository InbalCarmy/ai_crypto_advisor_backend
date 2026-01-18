
export const aiInsightService = {
    generateInsight
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
                model: 'llama-3.3-70b-versatile', // Fast and free model
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
