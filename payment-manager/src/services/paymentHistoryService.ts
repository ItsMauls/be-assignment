import prisma from "../config/prisma";
import Decimal from 'decimal.js';
import { TempTransactionData } from "src/types";

export const paymentHistoryService = {
    receiverPaymentHistory : async (transactionData: TempTransactionData) => {
        const {
          processedTransaction,
          from_account_id,
          amount,
        } = transactionData;
        
        await prisma.paymentHistory.create({
            data: {
              account_id: from_account_id,
              transaction_id: processedTransaction.id,
              amount: new Decimal(amount),
              transaction_type: 'receive',
            },
          });

        },
    createPaymentHistory : async (transactionData: TempTransactionData) => {
        const {
            processedTransaction,
            to_account_id,
            amount,
            toAccount
          } = transactionData;

          await prisma.paymentHistory.create({
            data: {
              account_id: to_account_id,
              transaction_id: processedTransaction.id,
              amount: new Decimal(amount),
              transaction_type: toAccount ? 'send' : 'withdraw',
            },
          });
    }
}

