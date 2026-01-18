import express from 'express'
import { getUser, getUsers, deleteUser, updateUser } from './user.controller.js'
import {requireAuth}  from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/:id',requireAuth ,updateUser)
router.delete('/:id', deleteUser)

export const userRoutes = router