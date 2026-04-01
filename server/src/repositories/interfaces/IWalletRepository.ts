import { IBaseRepository } from "./IBaseRepository";
import { IWallet, ITransaction } from "../../models/walletModel";
import { Types } from "mongoose";
import mongoose from "mongoose";

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
    transaction: ITransaction,
  ): Promise<IWallet>;

  getWalletWithBookings(
    userId: Types.ObjectId,
    userType: "user" | "owner",
    page?: number,
    limit?: number,
  ): Promise<{
    balance: number;
    transactions: ITransaction[];
    totalTransactions: number;
  } | null>;

creditWalletWithSession(
  userId: Types.ObjectId,
  userType: "user" | "owner",
  transaction: ITransaction,
  session: mongoose.ClientSession
): Promise<IWallet>;

}
