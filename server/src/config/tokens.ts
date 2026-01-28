export const TOKENS = {
  
  IUserRepository: Symbol.for("IUserRepository"),
  IOwnerRepository: Symbol.for("IOwnerRepository"),
  IAdminRepository: Symbol.for("IAdminRepository"),
  IBaseRepository: Symbol.for("IBaseRepository"),
  IPropertyRepository: Symbol.for("IPropertyRepository"),
  IBookingRepository: Symbol.for("IBookingRepository"),
  IWalletRepository:Symbol.for("IWalletRepository"),
  IReviewRepository:Symbol.for("IReviewRepository"),
  
  IUserService: Symbol.for("IUserService"),
  IOwnerService: Symbol.for("IOwnerService"),
  IAdminService: Symbol.for("IAdminService"),
  IPropertyService: Symbol.for("IPropertyService"),
  IBookingService:Symbol.for("IBookingService"),
  IReviewService:Symbol.for("IReviewService"),

  IUserController: Symbol.for("IUserController"),
  IOwnerController: Symbol.for("IOwnerController"),
  IAdminController: Symbol.for("IAdminController"),
  IPropertyController: Symbol.for("IPropertyController"),
  IBookingController: Symbol.for("IBookingController"),
  IReviewController: Symbol.for("IReviewController"),

  IOTPService: Symbol.for("IOTPService"),
  ILogger: Symbol.for("ILogger"),
};