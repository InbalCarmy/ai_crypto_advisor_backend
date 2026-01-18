
export const newsService = {
    getNews
}

async function getNews(currencies = 'BTC,ETH') {
    try {
        const baseUrl = 'https://cryptopanic.com/api/developer/v2/posts/'
        const params = new URLSearchParams({
            auth_token: process.env.CRYPTOPANIC_API_KEY,
            currencies: currencies,
            kind: 'news',
            public: 'true'
        })

        const fullUrl = `${baseUrl}?${params}`
        console.log('Fetching news from:', fullUrl)

        const response = await fetch(fullUrl)

        if (!response.ok) {
            const errorText = await response.text()
            // console.log('Error response:', errorText)
            throw new Error(`CryptoPanic API Error: ${response.status}`)
        }

        const data = await response.json()

        console.log('data:', data);
        

        // Transform and return the results
        return {
            results: data.results.slice(0, 5).map(article => ({
                id: article.id,
                title: article.title,
                source: article.source?.title || 'Unknown',
                url: article.url,
                published_at: article.published_at,
                votes: article.votes
            }))
        }
    } catch (err) {
        console.error('Error fetching news:', err)
        throw err
    }
}
