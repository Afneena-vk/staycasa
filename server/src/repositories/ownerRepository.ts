

import { injectable } from 'tsyringe';
import Owner, { IOwner } from '../models/ownerModel';
import { BaseRepository } from './baseRepository';
import { IOwnerRepository } from './interfaces/IOwnerRepository';


@injectable()
export class OwnerRepository extends BaseRepository<IOwner> implements IOwnerRepository {
  constructor() {
    super(Owner);
  }

  async findByEmail(email: string): Promise<IOwner | null> {
    return Owner.findOne({ email }).exec();
  }

  async findByPhone(phone: string): Promise<IOwner | null> {
    return Owner.findOne({ phone }).exec();
  }

   async updateDocument(ownerId: string, document: string ): Promise<IOwner | null> {
    return await this.model.findByIdAndUpdate(
      ownerId,
      { document },
      { new: true }
    ).exec();
   }

   async getOwnerStatusCounts(): Promise<{ _id: string; count: number }[]> {
    return await Owner.aggregate([
      {
        $project: {
          status: {
            $cond: [
              { $eq: ['$isBlocked', true] },
              'blocked',
              '$approvalStatus'
            ]
          }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
  }


}

//export default new OwnerRepository();
