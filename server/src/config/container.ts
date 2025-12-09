import "reflect-metadata";
import { container } from "tsyringe";
import { TOKENS } from "./tokens";


import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IOwnerRepository } from "../repositories/interfaces/IOwnerRepository";
import { IAdminRepository } from "../repositories/interfaces/IAdminRepository";
import { IPropertyRepository } from "../repositories/interfaces/IPropertyRepository";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { PropertyRepository } from "../repositories/propertyRepository";
import { UserRepository } from "../repositories/userRepository";
import { OwnerRepository } from "../repositories/ownerRepository";
import { AdminRepository } from "../repositories/adminRepository";
import { BookingRepository } from "../repositories/bookingRepository";

import { IUserService } from "../services/interfaces/IUserService";
import { IOwnerService } from "../services/interfaces/IOwnerService";
import { IAdminService } from "../services/interfaces/IAdminService";
import { IPropertyService } from "../services/interfaces/IPropertyService";
import { IBookingService } from "../services/interfaces/IBookingService";
import { PropertyService } from "../services/propertyService";
import { UserService } from "../services/userService";
import { OwnerService } from "../services/ownerService";
import { AdminService } from "../services/adminService";
import { BookingService} from  "../services/bookingService"

import { IUserController } from "../controllers/interfaces/IUserController";
import { IOwnerController } from "../controllers/interfaces/IOwnerController";
import { IAdminController } from "../controllers/interfaces/IAdminController";
import { IPropertyController } from "../controllers/interfaces/IPropertyController";
import { IBookingController } from "../controllers/interfaces/IBookingController";
import { PropertyController } from "../controllers/propertyController";
import { UserController } from "../controllers/userController";
import { OwnerController } from "../controllers/ownerController";
import { AdminController } from "../controllers/adminController";
import { BookingController} from "../controllers/bookingController"

container.registerSingleton<IUserRepository>(TOKENS.IUserRepository, UserRepository);
container.registerSingleton<IOwnerRepository>(TOKENS.IOwnerRepository, OwnerRepository);
container.registerSingleton<IAdminRepository>(TOKENS.IAdminRepository, AdminRepository);
container.registerSingleton<IPropertyRepository>(TOKENS.IPropertyRepository, PropertyRepository);
container.registerSingleton<IBookingRepository>(TOKENS.IBookingRepository, BookingRepository);

container.registerSingleton<IUserService>(TOKENS.IUserService, UserService);
container.registerSingleton<IOwnerService>(TOKENS.IOwnerService, OwnerService);
container.registerSingleton<IAdminService>(TOKENS.IAdminService, AdminService);
container.registerSingleton<IPropertyService>(TOKENS.IPropertyService, PropertyService);
container.registerSingleton<IBookingService>(TOKENS.IBookingService, BookingService);

container.registerSingleton<IUserController>(TOKENS.IUserController, UserController);
container.registerSingleton<IOwnerController>(TOKENS.IOwnerController, OwnerController);
container.registerSingleton<IAdminController>(TOKENS.IAdminController, AdminController);
container.registerSingleton<IPropertyController>(TOKENS.IPropertyController, PropertyController);
container.registerSingleton<IBookingController>(TOKENS.IBookingController, BookingController);

export { container };