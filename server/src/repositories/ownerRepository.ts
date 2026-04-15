

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

  async updateOwnerSafe(
  id: string,
  data: Partial<IOwner>
): Promise<IOwner | null> {

  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined)
  );

  return await Owner.findByIdAndUpdate(
    id,
    { $set: cleanData },
    { new: true, runValidators: true }
  ).exec();
}


}

//export default new OwnerRepository();
