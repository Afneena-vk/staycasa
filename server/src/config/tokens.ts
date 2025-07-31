export const TOKENS = {
  // Repository tokens
  IUserRepository: Symbol.for("IUserRepository"),
  IOwnerRepository: Symbol.for("IOwnerRepository"),
  IAdminRepository: Symbol.for("IAdminRepository"),
  IBaseRepository: Symbol.for("IBaseRepository"),

  // Service tokens
  IUserService: Symbol.for("IUserService"),
  IOwnerService: Symbol.for("IOwnerService"),
  IAdminService: Symbol.for("IAdminService"),

  // Controller tokens
  IUserController: Symbol.for("IUserController"),
  IOwnerController: Symbol.for("IOwnerController"),
  IAdminController: Symbol.for("IAdminController"),

  // Utility tokens
  IOTPService: Symbol.for("IOTPService"),
  ILogger: Symbol.for("ILogger"),
};