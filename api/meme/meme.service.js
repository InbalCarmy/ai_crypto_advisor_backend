
export const memeService = {
    getMeme
}

async function getMeme() {
    try {
        const response = await fetch('https://www.reddit.com/r/CryptoCurrency/hot.json?limit=50')

        if (!response.ok) {
            throw new Error(`Reddit API Error: ${response.status}`)
        }

        const data = await response.json()

        // Filter for posts that are images/memes
        const memePosts = data.data.children.filter(post => {
            const postData = post.data
            return (
                postData.post_hint === 'image' ||
                postData.url.match(/\.(jpg|jpeg|png|gif)$/i)
            )
        })

        if (memePosts.length === 0) {
            throw new Error('No crypto memes found')
        }

        const randomIndex = Math.floor(Math.random() * memePosts.length)
        const randomMeme = memePosts[randomIndex].data

        return {
            id: randomMeme.id,
            title: randomMeme.title,
            url: randomMeme.url,
            author: randomMeme.author,
            score: randomMeme.score,
            created_utc: randomMeme.created_utc,
            permalink: `https://reddit.com${randomMeme.permalink}`,
            thumbnail: randomMeme.thumbnail
        }
    } catch (err) {
        console.error('Error fetching crypto meme:', err)
        throw err
    }
}
