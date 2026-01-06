import { injectable } from "tsyringe";
import Wallet, { IWallet, ITransaction } from "../models/walletModel";
import { BaseRepository } from "./baseRepository";
import {IWalletRepository} from  './interfaces/IWalletRepository';
import { Types } from "mongoose";

@injectable()
export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
  constructor() {
    super(Wallet);
  }

 async creditWallet(userId: Types.ObjectId,userType: "user" | "owner", transaction: ITransaction): Promise<IWallet> {
     const wallet= await this.model.findOneAndUpdate(
         { userId, userType},
           
    {
      $inc: { balance: transaction.amount },
      $push: { transactions: transaction }
    },
    { new: true, upsert: true }

     );
      if (!wallet) {
    throw new Error("Failed to credit wallet");
  }

  return wallet; 
 }


 async debitWallet(userId: Types.ObjectId,userType: "user" | "owner",transaction: ITransaction): Promise<IWallet> {

  const wallet = await this.model.findOneAndUpdate(
    {
      userId,
      userType,
      balance: { $gte: transaction.amount }
    },
    {
      $inc: { balance: -transaction.amount },
      $push: { transactions: transaction }
    },
    { new: true }
  );

  if (!wallet) {
    throw new Error("Insufficient wallet balance");
  }

  return wallet;
}


async getWalletWithBookings(
  userId:Types.ObjectId,
  userType: "user" | "owner"
): Promise<IWallet | null> {
  return await this.model
  .findOne({userId,userType})
  .populate({
    path: "transactions.bookingId",
    select: "bookingId propertyId totalCost bookingStatus createdAt"
  })
  .exec();
}

}