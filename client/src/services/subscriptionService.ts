import { api } from "../api/api";
import { ADMIN_API, OWNER_API } from "../constants/apiRoutes";
import {
  SubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
  AdminSubscriptionDto,
  AdminSubscriptionFilterDto,
  AdminSubscriptionListResponseDto
} from "../types/subscription";

export const subscriptionService = {
  getAllPlans: async (): Promise<SubscriptionPlanDto[]> => {
    const res = await api.get(ADMIN_API.SUBSCRIPTION_PLANS);
    return res.data.data;
  },

  updatePlan: async (
    planId: string,
    data: UpdateSubscriptionPlanDto,
  ): Promise<SubscriptionPlanDto> => {
    const res = await api.patch(
      ADMIN_API.UPDATE_SUBSCRIPTION_PLAN(planId),
      data,
    );
    return res.data.data;
  },

  getAllPlansforOwner: async (): Promise<SubscriptionPlanDto[]> => {
    const res = await api.get(OWNER_API.SUBSCRIPTION_PLANS);
    return res.data.data;
  },

    createOrder: async (planId: string) => {
    const res = await api.post(OWNER_API.CREATE_SUBSCRIPTION_ORDER, { planId });
    return res.data.order; 
  },

    verifyPayment: async (payload: {
    planId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }) => {
    const res = await api.post(OWNER_API.VERIFY_SUBSCRIPTION_PAYMENT, payload);
    return res.data;
  },


  subscribe: async (planId: string, paymentId: string) => {
    const res = await api.post(OWNER_API.SUBSCRIBE, { planId, paymentId });
    return res.data;
  },

  getCurrentSubscription: async () => {
    const res = await api.get(OWNER_API.CURRENT_SUBSCRIPTION);
    return res.data.data;
  },


getAllAdminSubscriptions: async (
  filters: AdminSubscriptionFilterDto
// ): Promise<{
//   data: AdminSubscriptionDto[];
//   pagination: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   };
// }> => {
): Promise<AdminSubscriptionListResponseDto> => {
  const res = await api.get(ADMIN_API.ALL_SUBSCRIPTIONS, {
    params: filters,
  });

  return {
    data: res.data.data,
    pagination: res.data.pagination,
    revenue: res.data.revenue,
  };
},



};
