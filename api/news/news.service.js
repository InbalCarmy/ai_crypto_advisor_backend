
export const newsService = {
    getNews
}

const FALLBACK_NEWS = {
    results: [
        {
            id: 1,
            title: 'Bitcoin Reaches New All-Time High Amid Institutional Adoption',
            source: 'CryptoNews',
            url: 'https://cryptonews.com',
            published_at: new Date().toISOString(),
            votes: { positive: 150, negative: 10 }
        },
        {
            id: 2,
            title: 'Ethereum 2.0 Staking Surpasses Major Milestone',
            source: 'CoinDesk',
            url: 'https://coindesk.com',
            published_at: new Date(Date.now() - 3600000).toISOString(),
            votes: { positive: 120, negative: 5 }
        },
        {
            id: 3,
            title: 'Major Bank Announces Cryptocurrency Trading Services',
            source: 'Bloomberg Crypto',
            url: 'https://bloomberg.com',
            published_at: new Date(Date.now() - 7200000).toISOString(),
            votes: { positive: 200, negative: 15 }
        },
        {
            id: 4,
            title: 'DeFi Protocol Launches New Yield Farming Opportunities',
            source: 'DeFi Pulse',
            url: 'https://defipulse.com',
            published_at: new Date(Date.now() - 10800000).toISOString(),
            votes: { positive: 95, negative: 8 }
        },
        {
            id: 5,
            title: 'Regulatory Framework for Crypto Assets Released',
            source: 'Reuters',
            url: 'https://reuters.com',
            published_at: new Date(Date.now() - 14400000).toISOString(),
            votes: { positive: 180, negative: 25 }
        }
    ]
}

async function getNews(currencies = 'BTC,ETH') {
    try {
        const baseUrl = 'https://cryptopanic.com/api/developer/v2/posts/'
        const params = new URLSearchParams({
            auth_token: process.env.CRYPTOPANIC_API_KEY,
            currencies: currencies,
            filter: 'hot',
            kind: 'news'
        })

        const fullUrl = `${baseUrl}?${params}`
        console.log('Fetching news from:', fullUrl)

        const response = await fetch(fullUrl)

        if (!response.ok) {
            const errorText = await response.text()
            console.log('Error response:', errorText)
            console.log('Using fallback news data due to API error')
            return FALLBACK_NEWS
        }

        const data = await response.json()

        if (!data.results || data.results.length === 0) {
            console.log('No results from API, using fallback news data')
            return FALLBACK_NEWS
        }

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
        console.log('Using fallback news data')
        return FALLBACK_NEWS
    }
}
