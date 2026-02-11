import { StateCreator } from "zustand";
import { subscriptionService } from "../../services/subscriptionService";
import { SubscriptionPlanDto,UpdateSubscriptionPlanDto, CurrentSubscriptionDto, AdminSubscriptionDto, AdminSubscriptionFilterDto } from "../../types/subscription";

export interface SubscriptionSlice {
  subscriptionLoading: boolean;
  subscriptionError: string | null;
  subscriptionMessage: string | null;
  plans: SubscriptionPlanDto[];
  currentSubscription: CurrentSubscriptionDto | null;

  adminSubscriptions: AdminSubscriptionDto[];
  adminSubscriptionsPagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;

  adminSubscriptionRevenue: number | null; 
  

  fetchPlans: () => Promise<void>;
  updatePlan: (planId: string, data: UpdateSubscriptionPlanDto) => Promise<void>;

  fetchPlansForOwner: () => Promise<void>;
  fetchCurrentSubscription: () => Promise<void>;
  subscribeToPlan: (planId: string) => Promise<void>;
  fetchAllAdminSubscriptions: (filters: AdminSubscriptionFilterDto) => Promise<void>;
 
}

export const createSubscriptionSlice: StateCreator<
  SubscriptionSlice,
  [],
  [],
  SubscriptionSlice
> = (set) => ({
  subscriptionLoading: false,
  subscriptionError: null,
  subscriptionMessage: null,
  plans: [],
  currentSubscription: null,

  adminSubscriptions: [],
  adminSubscriptionsPagination: null,
  adminSubscriptionRevenue: null,

  fetchPlans: async () => {
    set({ subscriptionLoading: true, subscriptionError: null });
    try {
      const plans = await subscriptionService.getAllPlans();
      set({ plans });
    } catch (err: any) {
      set({
        subscriptionError:
          err.response?.data?.error || err.message || "Failed to fetch plans",
      });
    } finally {
      set({ subscriptionLoading: false });
    }
  },

  updatePlan: async (planId, data) => {
    set({ subscriptionLoading: true, subscriptionError: null });
    try {
      const updatedPlan = await subscriptionService.updatePlan(planId, data);

      set((state) => ({
        plans: state.plans.map((p) =>
          p.id === updatedPlan.id ? updatedPlan : p
        ),
      }));
    } catch (err: any) {
      set({
        subscriptionError:
          err.response?.data?.error || err.message || "Failed to update plan",
      });
      throw err;
    } finally {
      set({ subscriptionLoading: false });
    }
  },

  fetchPlansForOwner: async () => {
    set({ subscriptionLoading: true, subscriptionError: null });
    try {
      const plans = await subscriptionService.getAllPlansforOwner();
      set({ plans });
    } catch (err: any) {
    //   set({ subscriptionError: err.message || "Failed to fetch plans" });
          set({
        subscriptionError:
          err.response?.data?.message || "Failed to fetch plans",
      });
    } finally {
      set({ subscriptionLoading: false });
    }
  },

    fetchCurrentSubscription: async () => {
    set({ subscriptionLoading: true });
    try {
      const data = await subscriptionService.getCurrentSubscription();
      set({ currentSubscription: data });
    } finally {
      set({ subscriptionLoading: false });
    }
  },

subscribeToPlan: async (planId: string) => {
  set({
    subscriptionLoading: true,
    subscriptionError: null,
    subscriptionMessage: null,
  });

  try {
   
    const order = await subscriptionService.createOrder(planId);


    console.log("Order from backend:", order);
    console.log("Razorpay SDK:", (window as any).Razorpay);
    console.log("Key:", import.meta.env.VITE_RAZORPAY_KEY_ID);

      if (!(window as any).Razorpay) {
      throw new Error("Razorpay SDK not loaded");
    }

    
    const options: any = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
      amount: order.amount,
      currency: order.currency,
      name: "Your App Name",
      description: "Subscription Payment",
      order_id: order.id,
      handler: async function (response: any) {
        try {
          
          await subscriptionService.verifyPayment({
            planId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });

          set({
            subscriptionMessage: "Subscription activated successfully 🎉",
          });

          const data = await subscriptionService.getCurrentSubscription();
          set({ currentSubscription: data });
        } catch (err: any) {
          set({
            subscriptionError:
              err.response?.data?.message || "Payment verification failed",
          });
        } finally {
          set({ subscriptionLoading: false });
        }
      },
      prefill: {
        name: "Owner",
        email: "owner@email.com",
      },
      theme: {
        color: "#4f46e5",
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  } catch (err: any) {
    set({
      subscriptionError:
        err.response?.data?.message || "Payment initialization failed",
    });
    set({ subscriptionLoading: false });
  }
},


fetchAllAdminSubscriptions: async (filters) => {
  set({ subscriptionLoading: true, subscriptionError: null });

  try {
    const res = await subscriptionService.getAllAdminSubscriptions(filters);

    set({
      adminSubscriptions: res.data,
      adminSubscriptionsPagination: res.pagination,
      adminSubscriptionRevenue: res.revenue,
    });
  } catch (err: any) {
    set({
      subscriptionError:
        err.response?.data?.message || "Failed to fetch subscriptions",
    });
  } finally {
    set({ subscriptionLoading: false });
  }
},


});