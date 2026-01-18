import 'dotenv/config'
import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { newsRoutes } from './api/news/news.routes.js'
import { aiInsightRoutes } from './api/ai-insight/ai-insight.routes.js'
import { coinPricesRoutes } from './api/coin-prices/coin-prices.routes.js'
import { memeRoutes } from './api/meme/meme.routes.js'

import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'

const app = express()
const server = http.createServer(app)

// Express App Config
app.use(cookieParser())
app.use(express.json())


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('public')))
} else {
    const corsOptions = {
        origin: [
            'http://127.0.0.1:8080',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://localhost:5173'
        ],
        credentials: true
    }
    app.use(cors(corsOptions))
}

// app.all('/*all', setupAsyncLocalStorage)

// app.use('/api/auth', authRoutes)
// app.use('/api/user', userRoutes)


app.use('/api/auth', setupAsyncLocalStorage, authRoutes)
app.use('/api/user', setupAsyncLocalStorage, userRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/ai-insight', aiInsightRoutes)
app.use('/api/coin-prices', coinPricesRoutes)
app.use('/api/meme', memeRoutes)



// Make every unhandled server-side-route match index.html
// so when requesting http://localhost:3030/unhandled-route...
// it will still serve the index.html file
// and allow vue/react-router to take it from there

// Uncomment when you have a public/index.html file
app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

import { loggerService} from './services/logger.service.js'
const port = process.env.PORT || 3030

server.listen(port, () => {
    loggerService.info('Server is running on: ' + `http://localhost:${port}/`)
})



