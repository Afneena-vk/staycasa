// // repositories/ownerRepository.ts
// import Owner, { IOwner } from '../models/ownerModel';
// import { IOwnerRepository } from '../repositories/interfaces/IOwnerRepository';

// export class OwnerRepository implements IOwnerRepository {
    
//   async create(ownerData: Partial<IOwner>): Promise<IOwner> {
//     const owner = new Owner(ownerData);
//     return await owner.save();
//   }

//   async findByEmail(email: string): Promise<IOwner | null> {
//     return await Owner.findOne({ email });
//   }

//   async findById(id: string): Promise<IOwner | null> {
//     return await Owner.findById(id);
//   }

//   async updateById(id: string, updateData: Partial<IOwner>): Promise<IOwner | null> {
//     return await Owner.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     );
//   }
// }

// export default new OwnerRepository();
// src/repositories/ownerRepository.ts

import Owner, { IOwner } from '../models/ownerModel';
import { BaseRepository } from './baseRepository';
import { IOwnerRepository } from './interfaces/IOwnerRepository';

class OwnerRepository extends BaseRepository<IOwner> implements IOwnerRepository {
  constructor() {
    super(Owner);
  }

  async findByEmail(email: string): Promise<IOwner | null> {
    return Owner.findOne({ email }).exec();
  }

  async findByPhone(phone: string): Promise<IOwner | null> {
    return Owner.findOne({ phone }).exec();
  }
}

export default new OwnerRepository();
