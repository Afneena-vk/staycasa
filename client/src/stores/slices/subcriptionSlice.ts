import { StateCreator } from "zustand";
import { subscriptionService } from "../../services/subscriptionService";
import { SubscriptionPlanDto,UpdateSubscriptionPlanDto } from "../../types/subscription";

export interface SubscriptionSlice {
  subscriptionLoading: boolean;
  subscriptionError: string | null;
  plans: SubscriptionPlanDto[];

  fetchPlans: () => Promise<void>;
  updatePlan: (planId: string, data: UpdateSubscriptionPlanDto) => Promise<void>;
}

export const createSubscriptionSlice: StateCreator<
  SubscriptionSlice,
  [],
  [],
  SubscriptionSlice
> = (set) => ({
  subscriptionLoading: false,
  subscriptionError: null,
  plans: [],

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
});