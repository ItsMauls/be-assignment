import express from 'express'
import authRoutes from './auth'
import accountPaymentRoutes from './accounts'
import { authMiddleware } from '../middlewares/authentication'

export const routes = express()
.use('/auth', authRoutes)
.use('/account', authMiddleware, accountPaymentRoutes)