import express from 'express';
import { paymentController } from '../controllers/transactionController';
import { authMiddleware } from '../middlewares/authentication';


const transactionRoutes = express.Router();

transactionRoutes
    .get('/:id', authMiddleware, paymentController.getTransactionByIdHandler)
    .get('/', authMiddleware, paymentController.getTransactionsByUserIdHandler)
    .post('/send', authMiddleware, paymentController.sendTransactionHandler)
    .post('/withdraw', authMiddleware, paymentController.withdrawTransactionHandler);

export default transactionRoutes;