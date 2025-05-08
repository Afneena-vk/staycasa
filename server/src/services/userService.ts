
import { IUserService, SignupData } from "./interfaces/IUserService";
import userRepository from "../repositories/userRepository";
import bcrypt from "bcryptjs";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

class UserService implements IUserService {
  async registerUser(data: SignupData): Promise<{ message: string }> {
    const { name, email, phone, password, confirmPassword } = data;

    if (!name || !email || !phone || !password || !confirmPassword) {
      const error: any = new Error(MESSAGES.ERROR.MISSING_FIELDS);
      error.status = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    if (password !== confirmPassword) {
      const error: any = new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
      error.status = STATUS_CODES.BAD_REQUEST;
      throw error;
    }

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      const error: any = new Error(MESSAGES.ERROR.EMAIL_EXISTS);
      error.status = STATUS_CODES.CONFLICT;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userRepository.create({
      name,
      email,
      phone,
      password: hashedPassword,
      isVerified: false,
    });

    return { message: "User registered successfully" };
  }
}

export default new UserService();
