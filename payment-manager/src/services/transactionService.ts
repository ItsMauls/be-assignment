
import { TempTransactionData, Transaction } from "src/types";
import prisma from "../config/prisma";
import { paymentHistoryService } from "./paymentHistoryService";
import Decimal from "decimal.js";
import { processTransaction } from "../utils";

export const transactionService = {
    
    getTransactionById : async (transactionId: string) => {
      const transaction = await prisma.transaction.findUnique({
        where: {
          id: transactionId,
        },
      });
      return transaction;
    },
    
    getTransactionsByUserId : async (userId: string) => {
      const transactions = await prisma.transaction.findMany({
        where: {
          OR: [
            {
              from_account: {
                user_id: userId,
              },
            },
            {
              to_account: {
                user_id: userId,
              },
            },
          ],
        },
      });
      return transactions;
    },
    processSendTransaction: async (transaction: Transaction) => {
      const { from_account_id, to_account_id, amount } = transaction;
  
      if (!from_account_id || !to_account_id || !amount) {
        throw new Error('Missing required fields');
      }
  
      const fromAccount = await prisma.paymentAccount.findUnique({
        where: { id: from_account_id },
      });
  
      if (!fromAccount) {
        throw new Error('Sender payment account not found');
      }
  
      const toAccount = await prisma.paymentAccount.findUnique({
        where: { id: to_account_id },
      });
  
      if (!toAccount) {
        throw new Error('Recipient payment account not found');
      }
  
      if (fromAccount.balance.lt(new Decimal(amount))) {
        throw new Error('Insufficient balance');
      }
  
      const processedTransaction = await prisma.transaction.create({
        data: {
          from_account: {
            connect: { id: from_account_id },
          },
          to_account: {
            connect: { id: to_account_id },
          },
          amount: new Decimal(amount),
          timestamp: new Date(),
          status: 'pending',
        },
      });
  
      await processTransaction(processedTransaction);
  
      await prisma.paymentAccount.update({
        where: { id: from_account_id },
        data: {
          balance: fromAccount.balance.minus(new Decimal(amount)),
        },
      });
  
      await prisma.paymentAccount.update({
        where: { id: to_account_id },
        data: {
          balance: toAccount.balance.plus(new Decimal(amount)),
        },
      });
  
      await prisma.transaction.update({
        where: { id: processedTransaction.id },
        data: {
          status: 'success',
        },
      });
  
      const transactionData : any= {
        processedTransaction,
        from_account_id,
        to_account_id,
        amount,
        toAccount
      };
  
      await paymentHistoryService.createPaymentHistory(transactionData);
      await paymentHistoryService.receiverPaymentHistory(transactionData);
  
      console.log('Send transaction processed for:', processedTransaction);
      return processedTransaction;
    },
    processWithdrawTransaction: async (transaction: Transaction) => {
      const { from_account_id, amount } = transaction;
  
      if (!from_account_id || !amount) {
        throw new Error('Missing required fields');
      }
  
      const fromAccount = await prisma.paymentAccount.findUnique({
        where: { id: from_account_id },
      });
  
      if (!fromAccount) {
        throw new Error('Payment account not found');
      }
  
      if (fromAccount.balance.lt(new Decimal(amount))) {
        throw new Error('Insufficient balance');
      }
  
      const processedTransaction = await prisma.transaction.create({
        data: {
          from_account: {
            connect: { id: from_account_id },
          },
          to_account: {
            connect: { id: from_account_id },
          },          
          amount: new Decimal(amount),
          timestamp: new Date(),
          status: 'pending',
        } as any,
      });
  
      await processTransaction(processedTransaction);
  
      await prisma.paymentAccount.update({
        where: { id: from_account_id },
        data: {
          balance: fromAccount.balance.minus(new Decimal(amount)),
        },
      });
  
      await prisma.transaction.update({
        where: { id: processedTransaction.id },
        data: {
          status: 'success',
        },
      });
  
      const transactionData : TempTransactionData | any= {
        processedTransaction,
        from_account_id,
        amount,
      };
  
      await paymentHistoryService.createPaymentHistory(transactionData);
  
      console.log('Withdraw transaction processed for:', processedTransaction);
      return processedTransaction;
    },
    
}

