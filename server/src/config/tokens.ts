export const TOKENS = {
  
  IUserRepository: Symbol.for("IUserRepository"),
  IOwnerRepository: Symbol.for("IOwnerRepository"),
  IAdminRepository: Symbol.for("IAdminRepository"),
  IBaseRepository: Symbol.for("IBaseRepository"),
  IPropertyRepository: Symbol.for("IPropertyRepository"),
  IBookingRepository: Symbol.for("IBookingRepository"),
  
  IUserService: Symbol.for("IUserService"),
  IOwnerService: Symbol.for("IOwnerService"),
  IAdminService: Symbol.for("IAdminService"),
  IPropertyService: Symbol.for("IPropertyService"),
 
  IUserController: Symbol.for("IUserController"),
  IOwnerController: Symbol.for("IOwnerController"),
  IAdminController: Symbol.for("IAdminController"),
  IPropertyController: Symbol.for("IPropertyController"),
  
  IOTPService: Symbol.for("IOTPService"),
  ILogger: Symbol.for("ILogger"),
};