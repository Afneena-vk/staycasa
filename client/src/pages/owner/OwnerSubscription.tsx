  

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import OwnerSidebar from "../../components/Owner/OwnerSidebar";

const OwnerSubscriptionPage = () => {
  const {
    plans,
    fetchPlansForOwner,
    currentSubscription,
    fetchCurrentSubscription,
    subscribeToPlan,
    subscriptionLoading,
    subscriptionError,
    subscriptionMessage,
  } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchPlansForOwner();
    fetchCurrentSubscription();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <OwnerSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="w-64 bg-white shadow-lg">
            <OwnerSidebar />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1">
        {/* Topbar for mobile */}
        <div className="lg:hidden flex items-center justify-between bg-white p-4 shadow-sm sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold">Subscription</h1>
          <div />
        </div>

        <div className="p-6 space-y-8 max-w-7xl mx-auto">
          <h1 className="hidden lg:block text-2xl font-bold">
            Subscription Plans
          </h1>

          {/* Current Subscription */}
          {currentSubscription?.hasActiveSubscription &&
            currentSubscription.subscription && (
              <div className="bg-white rounded-2xl p-6 shadow border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Your Current Plan</h2>
                  <p className="mt-1 text-gray-600">
                    <span className="font-medium text-gray-900">
                      {currentSubscription.subscription.planName}
                    </span>{" "}
                    – {currentSubscription.subscription.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    Remaining Days:{" "}
                    {currentSubscription.subscription.remainingDays}
                  </p>
                  <p className="text-sm text-gray-500">
                    Usage: {currentSubscription.subscription.usedProperties} /{" "}
                    {currentSubscription.subscription.maxProperties ?? "∞"}{" "}
                    properties
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  Active
                </span>
              </div>
            )}
            {subscriptionError && (
  <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
    {subscriptionError}
  </div>
)}

{subscriptionMessage && (
  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-4">
    {subscriptionMessage}
  </div>
)}


          {/* Plans */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Plans</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-6 flex flex-col"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <p className="text-gray-500 text-sm">{plan.duration}</p>

                    <p className="text-3xl font-bold mt-4 text-indigo-600">
                      ₹{plan.price}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Max Properties:{" "}
                      <span className="font-medium">
                        {plan.maxProperties ?? "Unlimited"}
                      </span>
                    </p>
                  </div>

                  <button
                    disabled={subscriptionLoading}
                    onClick={() => subscribeToPlan(plan.id)}
                    className="mt-6 w-full rounded-xl bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 transition disabled:opacity-60"
                  >
                    {subscriptionLoading ? "Processing..." : "Subscribe"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerSubscriptionPage;




