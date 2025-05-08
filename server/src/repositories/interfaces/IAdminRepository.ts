// src/repositories/interfaces/IAdminRepository.ts

import { IBaseRepository } from './IBaseRepository';
import { IAdmin } from '../../models/adminModel';

export interface IAdminRepository extends IBaseRepository<IAdmin> {
  findByEmail(email: string): Promise<IAdmin | null>;
}
