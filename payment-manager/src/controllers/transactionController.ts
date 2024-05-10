import { Request, Response } from 'express';
import { transactionService } from '../services/transactionService';

import { STATUS } from '../constants/status';
import { AuthenticatedRequest, Transaction } from 'src/types';

export const transactionController = {
  
  getTransactionByIdHandler : async (req: Request, res: Response) => {
    try {
      const transactionId = req.params.id;
      const transaction = await transactionService.getTransactionById(transactionId);

      if (!transaction) {
        return res.status(STATUS.NOT_FOUND).json({ error: 'Transaction not found' });
      }

      res.json(transaction);
    } catch (error) {
      res.status(STATUS.NETWORK_ERROR).json({ error: 'Failed to get transaction' });
    }
  },
  
  getTransactionsByUserIdHandler : async (req: AuthenticatedRequest | any, res: Response) => {
    try {
      const userId = req.user.user.id;
      const transactions = await transactionService.getTransactionsByUserId(userId);
      res.json(transactions);
    } catch (error) {
      res.status(STATUS.NETWORK_ERROR).json({ error: 'Failed to get transactions' });
    }
  },
  
  processTransactionHandler : async (req: Request, res: Response) => {
    try {
      const transactionData = req.body;
      const transaction = await transactionService.processTransaction(transactionData);

      res.json(transaction);
    } catch (error) {
      res.status(STATUS.NETWORK_ERROR).json({ error: 'Failed to process transaction' });
    }
  },
}
