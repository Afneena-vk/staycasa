export const AUTH_API = {
  USER_SIGNUP: "/user/signup",
  OWNER_SIGNUP: "/owner/signup",

  USER_LOGIN: "/user/login",
  OWNER_LOGIN: "/owner/login",
  ADMIN_LOGIN: "/admin/login",

  USER_LOGOUT: "/user/logout",
  OWNER_LOGOUT: "/owner/logout",
  ADMIN_LOGOUT: "/admin/logout",

  VERIFY_OTP: (authType: "user" | "owner") => `/${authType}/verify-otp`,

  RESEND_OTP: (authType: "user" | "owner") => `/${authType}/resend-otp`,

  USER_FORGOT_PASSWORD: "/user/forgot-password",
  OWNER_FORGOT_PASSWORD: "/owner/forgot-password",

  USER_RESET_PASSWORD: "/user/reset-password",
  OWNER_RESET_PASSWORD: "/owner/reset-password",

  CHANGE_PASSWORD: (type: "user" | "owner") => `/${type}/change-password`,
};

export const USER_API = {
  PROFILE: "/user/profile",
  UPLOAD_PROFILE_IMAGE: "/user/profile/upload-image",

  PROPERTIES: "/user/properties",
  PROPERTY_BY_ID: (propertyId: string) => `/user/properties/${propertyId}`,

  // payments
  CALCULATE_TOTAL: "/user/payment/calculate-total",
  RAZORPAY_ORDER: "/user/payment/razorpay-order",
  VERIFY_PAYMENT: "/user/payment/verify",

  // bookings
  BOOKINGS: "/user/bookings",
  BOOKING_BY_ID: (bookingId: string) => `/user/bookings/${bookingId}`,

  CHECK_AVAILABILITY:(propertyId: string)=>`user/properties/${propertyId}/check-availability`,
  BLOCKED_DATES: (propertyId: string) =>`/user/properties/${propertyId}/blocked-dates`
};

export const OWNER_API = {
  PROFILE: "/owner/profile",
  UPLOAD_DOCUMENT: "/owner/upload-document",
  WALLET: "/owner/wallet",

  PROPERTIES: "/owner/properties",
  PROPERTY_BY_ID: (propertyId: string) => `/owner/properties/${propertyId}`,

  BOOKINGS: "/owner/bookings",
  BOOKING_BY_ID: (bookingId: string) => `/owner/bookings/${bookingId}`,
  BOOKING_STATS: "/owner/dashboard/stats"
};

export const ADMIN_API = {
  USERS: "/admin/users",
  USER_BY_ID: (userId: string) => `/admin/users/${userId}`,
  BLOCK_USER: (userId: string) => `/admin/users/${userId}/block`,
  UNBLOCK_USER: (userId: string) => `/admin/users/${userId}/unblock`,

  OWNERS: "/admin/owners",
  OWNER_BY_ID: (ownerId: string) => `/admin/owners/${ownerId}`,
  BLOCK_OWNER: (ownerId: string) => `/admin/owners/${ownerId}/block`,
  UNBLOCK_OWNER: (ownerId: string) => `/admin/owners/${ownerId}/unblock`,
  APPROVE_OWNER: (ownerId: string) => `/admin/owners/${ownerId}/approve`,
  REJECT_OWNER: (ownerId: string) => `/admin/owners/${ownerId}/reject`,

  PROPERTIES: "/admin/properties",
  PROPERTY_BY_ID: (propertyId: string) => `/admin/properties/${propertyId}`,
  APPROVE_PROPERTY: (propertyId: string) =>
    `/admin/properties/${propertyId}/approve`,
  REJECT_PROPERTY: (propertyId: string) =>
    `/admin/properties/${propertyId}/reject`,
  BLOCK_PROPERTY: (propertyId: string) =>
    `/admin/properties/${propertyId}/block`,
  UNBLOCK_PROPERTY: (propertyId: string) =>
    `/admin/properties/${propertyId}/unblock`,
  BOOKING_COUNT: "/admin/bookings-overview",
  USER_STATISTICS:"/admin/statistics"
};
