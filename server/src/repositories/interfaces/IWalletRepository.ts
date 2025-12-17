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
          
}