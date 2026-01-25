import { IBaseRepository } from './IBaseRepository';
import { IOwner } from '../../models/ownerModel';



export interface IOwnerRepository extends IBaseRepository<IOwner> {
  findByEmail(email: string): Promise<IOwner | null>;
  findByPhone(phone: string): Promise<IOwner | null>;
  updateDocument(ownerId: string, document: string): Promise<IOwner | null>;
  getOwnerStatusCounts(): Promise<{ _id: string; count: number }[]>;
}
