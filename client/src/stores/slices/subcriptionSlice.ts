import { StateCreator } from "zustand";
import { subscriptionService } from "../../services/subscriptionService";
import { SubscriptionPlanDto,UpdateSubscriptionPlanDto, CurrentSubscriptionDto } from "../../types/subscription";

export interface SubscriptionSlice {
  subscriptionLoading: boolean;
  subscriptionError: string | null;
  subscriptionMessage: string | null;
  plans: SubscriptionPlanDto[];
  currentSubscription: CurrentSubscriptionDto | null;

  fetchPlans: () => Promise<void>;
  updatePlan: (planId: string, data: UpdateSubscriptionPlanDto) => Promise<void>;

  fetchPlansForOwner: () => Promise<void>;
  fetchCurrentSubscription: () => Promise<void>;
  subscribeToPlan: (planId: string) => Promise<void>;
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
    set({ subscriptionLoading: true,
          subscriptionError: null,
          subscriptionMessage: null,
     });

    try {
       const res = await subscriptionService.subscribe(planId, "dummy-payment-id");
             set({
        subscriptionMessage: res.message,
      });
      //await useAuthStore.getState().fetchCurrentSubscription();
      const data = await subscriptionService.getCurrentSubscription();
     set({ currentSubscription: data });

    // } finally {
    //   set({ subscriptionLoading: false });
    // }
        } catch (err: any) {
      set({
        subscriptionError:
          err.response?.data?.message || "Subscription failed", 
      });
      throw err;
    } finally {
      set({ subscriptionLoading: false });
    }
  },

});