import express from 'express'

import { authMiddleware } from '../middlewares/authentication'
import paymentRoutes from './payment'

export const routes = express()
.use('/payment', authMiddleware, paymentRoutes)