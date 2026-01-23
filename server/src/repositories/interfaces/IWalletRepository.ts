import { IBaseRepository } from './IBaseRepository';
import { IWallet, ITransaction } from '../../models/walletModel';
import { Types } from 'mongoose';

export interface IWalletRepository extends IBaseRepository<IWallet> {
    creditWallet(
    userId: Types.ObjectId,
    userType: "user" | "owner",
    transaction: ITransaction,
    //amount: number
  ): Promise<IWallet>;


    debitWallet(
    userId: Types.ObjectId,
    userType: "user" | "owner",
    transaction: ITransaction
  ): Promise<IWallet>;


//   getWalletWithBookings(
//   userId: Types.ObjectId,
//   userType: "user" | "owner"
// ): Promise<IWallet | null>;


getWalletWithBookings(
  userId: Types.ObjectId,
  userType: "user" | "owner",
  page?: number,
  limit?: number
): Promise<{ balance: number; transactions: ITransaction[]; totalTransactions: number } | null> 
          
}