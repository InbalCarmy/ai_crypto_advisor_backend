import { config } from '../config/index.js'
import { loggerService } from '../services/logger.service.js'
import { asyncLocalStorage } from '../services/als.service.js'

export function requireAuth(req, res, next) {
	const store = asyncLocalStorage.getStore()
	const loggedinUser = store?.loggedinUser
	req.loggedinUser = loggedinUser

	if (!loggedinUser) return res.status(401).send('Not Authenticated')
	next()
}

export function requireAdmin(req, res, next) {
	const store = asyncLocalStorage.getStore()
	const loggedinUser = store?.loggedinUser

	if (!loggedinUser) return res.status(401).send('Not Authenticated')
	if (!loggedinUser.isAdmin) {
		loggerService.warn(loggedinUser.fullname + 'attempted to perform admin action')
		res.status(403).end('Not Authorized')
		return
	}
	next()
}
