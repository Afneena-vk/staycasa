// src/repositories/adminRepository.ts

import Admin, { IAdmin } from '../models/adminModel';
import { BaseRepository } from './baseRepository';
import { IAdminRepository } from './interfaces/IAdminRepository';

class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository {
  constructor() {
    super(Admin);
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email }).exec();
  }
}

export default new AdminRepository();
