import { Prisma } from "@prisma/client";
import { TypedRequest } from "./express";


export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResponseBody {
  user: any;
}

export interface AuthenticatedRequest extends Request {
  user: {
    user: {
      id: string;
    }
  },
  headers : any
}

export interface TempTransactionData {
  processedTransaction: any;
  to_account_id: number
  from_account_id: number
  amount: number
  toAccount: boolean
}
  
export type LoginRequest = TypedRequest<LoginRequestBody>;
// export type LoginResponse = TypedResponse<LoginResponseBody>;

export interface PaymentAccount {
  id: number;
  user_id: string;
  account_type: string;
  account_number: string;
  balance: number | string | any;
  payment_histories?: PaymentHistory[];
  sent_transactions?: Transaction[];
  received_transactions?: Transaction[];
}

export interface PaymentHistory {
  id: number;
  payment_account: PaymentAccount;
  account_id: number;
  transaction_id: string;
  amount: number;
  transaction_type: string;
  created_at: Date;
}

export interface Transaction {
  id? : string
  from_account?: PaymentAccount;
  from_account_id: number;
  to_account?: PaymentAccount;
  to_account_id: number;
  amount: number;
  timestamp: Date;
  status: string;
  currency?: string;
}