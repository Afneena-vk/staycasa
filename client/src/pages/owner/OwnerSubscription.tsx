


import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import ConfirmModal from "../../components/common/ConfirmModal";

const OwnerSubscriptionPage = () => {
  const {
    plans,
    fetchPlansForOwner,
    currentSubscription,
    fetchCurrentSubscription,
    subscribeToPlan,
    upgradeSubscription, // ✅ added
    subscriptionLoading,
    subscriptionError,
    subscriptionMessage,
  } = useAuthStore();

  const userData = useAuthStore((state) => state.userData);
  const isApproved = userData?.approvalStatus === "approved";

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    action: null | (() => Promise<void>);
  }>({ title: "", message: "", action: null });

  const openConfirmModal = (
    title: string,
    message: string,
    action: () => Promise<void>
  ) => {
    setConfirmConfig({ title, message, action });
    setIsConfirmOpen(true);
  };

  useEffect(() => {
    fetchPlansForOwner();
    fetchCurrentSubscription(); // ✅ important
  }, []);

  return (
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
          {plans.map((plan) => {
            // ✅ upgrade logic
            const currentPlanPrice =
              currentSubscription?.subscription?.price ?? 0;

            const isCurrentPlan =
              currentSubscription?.subscription?.planName === plan.name;

            const isUpgradeEligible = plan.price > currentPlanPrice;

            return (
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
                  disabled={
                    subscriptionLoading ||
                    !isApproved ||
                    isCurrentPlan ||
                    (currentSubscription?.hasActiveSubscription &&
                      !isUpgradeEligible)
                  }
                  onClick={() => {
                    if (!isApproved) return;

                    const isUpgrade =
                      currentSubscription?.hasActiveSubscription;

                    openConfirmModal(
                      isUpgrade
                        ? `Upgrade to "${plan.name}"?`
                        : `Subscribe to "${plan.name}"?`,
                      isUpgrade
                        ? `Upgrade from ${currentSubscription?.subscription?.planName} to ${plan.name}?`
                        : `Subscribe to "${plan.name}" for ₹${plan.price}?`,
                      async () => {
                        try {
                          if (isUpgrade) {
                            await upgradeSubscription(plan.id); 
                          } else {
                            await subscribeToPlan(plan.id); 
                          }
                        } finally {
                          setIsConfirmOpen(false);
                        }
                      }
                    );
                  }}
                  className="mt-6 w-full rounded-xl bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 transition disabled:opacity-60"
                >
                  {!isApproved
                    ? "Approval Pending"
                    : isCurrentPlan
                    ? "Current Plan"
                    : currentSubscription?.hasActiveSubscription &&
                      !isUpgradeEligible
                    ? "Not Allowed"
                    : subscriptionLoading
                    ? "Processing..."
                    : currentSubscription?.hasActiveSubscription
                    ? "Upgrade"
                    : "Subscribe"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        isLoading={subscriptionLoading}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() =>
          confirmConfig.action && confirmConfig.action()
        }
      />
    </div>
  );
};

export default OwnerSubscriptionPage;


// import { useEffect, useState } from "react";
// import { Menu, X } from "lucide-react";
// import { useAuthStore } from "../../stores/authStore";
// //import OwnerSidebar from "../../components/Owner/OwnerSidebar";
// import ConfirmModal from "../../components/common/ConfirmModal";

// const OwnerSubscriptionPage = () => {
//   const {
//     plans,
//     fetchPlansForOwner,
//     currentSubscription,
//     fetchCurrentSubscription,
//     subscribeToPlan,
//     subscriptionLoading,
//     subscriptionError,
//     subscriptionMessage,
    
//   } = useAuthStore();

//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const userData = useAuthStore((state) => state.userData);
//   const isApproved = userData?.approvalStatus === "approved";
//   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
//   const [confirmConfig, setConfirmConfig] = useState<{
//     title: string;
//     message: string;
//     action: null | (() => Promise<void>);
// }>({ title: "", message: "", action: null });

// const openConfirmModal = (title: string, message: string, action: () => Promise<void>) => {
//   setConfirmConfig({ title, message, action });
//   setIsConfirmOpen(true);
// };

//   useEffect(() => {
//     fetchPlansForOwner();
//     //fetchCurrentSubscription();
//   }, []);

//   return (


//         <div className="p-6 space-y-8 max-w-7xl mx-auto">
//           <h1 className="hidden lg:block text-2xl font-bold">
//             Subscription Plans
//           </h1>

//           {/* Current Subscription */}
//           {currentSubscription?.hasActiveSubscription &&
//             currentSubscription.subscription && (
//               <div className="bg-white rounded-2xl p-6 shadow border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                 <div>
//                   <h2 className="text-lg font-semibold">Your Current Plan</h2>
//                   <p className="mt-1 text-gray-600">
//                     <span className="font-medium text-gray-900">
//                       {currentSubscription.subscription.planName}
//                     </span>{" "}
//                     – {currentSubscription.subscription.status}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Remaining Days:{" "}
//                     {currentSubscription.subscription.remainingDays}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Usage: {currentSubscription.subscription.usedProperties} /{" "}
//                     {currentSubscription.subscription.maxProperties ?? "∞"}{" "}
//                     properties
//                   </p>
//                 </div>
//                 <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
//                   Active
//                 </span>
//               </div>
//             )}
//             {subscriptionError && (
//   <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
//     {subscriptionError}
//   </div>
// )}

// {subscriptionMessage && (
//   <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-4">
//     {subscriptionMessage}
//   </div>
// )}


//           {/* Plans */}
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Available Plans</h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {plans.map((plan) => (
//                 <div
//                   key={plan.id}
//                   className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-6 flex flex-col"
//                 >
//                   <div className="flex-1">
//                     <h3 className="text-lg font-bold">{plan.name}</h3>
//                     <p className="text-gray-500 text-sm">{plan.duration}</p>

//                     <p className="text-3xl font-bold mt-4 text-indigo-600">
//                       ₹{plan.price}
//                     </p>

//                     <p className="mt-2 text-sm text-gray-600">
//                       Max Properties:{" "}
//                       <span className="font-medium">
//                         {plan.maxProperties ?? "Unlimited"}
//                       </span>
//                     </p>
//                   </div>
// <button
//   disabled={subscriptionLoading || !isApproved}
//   // onClick={() => {
//   //   if (!isApproved) return;

//   //   const confirmed = window.confirm(
//   //     `Are you sure you want to subscribe to the "${plan.name}" plan for ₹${plan.price}?`
//   //   );
//   //   if (confirmed) {
//   //     subscribeToPlan(plan.id);
//   //   }
//   // }}
// onClick={() => {
//   if (!isApproved) return;

//   openConfirmModal(
//     `Subscribe to "${plan.name}"?`,
//     `Are you sure you want to subscribe to the "${plan.name}" plan for ₹${plan.price}?`,
//     async () => { 
//       try {
//         await subscribeToPlan(plan.id); // wait for subscription
//       } finally {
//         setIsConfirmOpen(false); // close modal after completion
//       }
//     }
//   );
// }}
//   className="mt-6 w-full rounded-xl bg-indigo-600 text-white py-2 font-medium hover:bg-indigo-700 transition disabled:opacity-60"
// >
//   {!isApproved
//     ? "Approval Pending"
//     : subscriptionLoading
//     ? "Processing..."
//     : "Subscribe"}
// </button>


//                 </div>
//               ))}
//             </div>
//           </div>
//           <ConfirmModal
//   isOpen={isConfirmOpen}
//   title={confirmConfig.title}
//   message={confirmConfig.message}
//   isLoading={subscriptionLoading}
//   onCancel={() => setIsConfirmOpen(false)}
//   onConfirm={() => confirmConfig.action && confirmConfig.action()}
// />
//         </div>

//   );
// };

// export default OwnerSubscriptionPage;


