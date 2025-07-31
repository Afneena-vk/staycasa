

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
}

//export default new OwnerRepository();
