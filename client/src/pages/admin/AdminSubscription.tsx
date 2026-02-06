// // src/pages/admin/AdminSubscriptionsPage.tsx
// import { useEffect, useState } from "react";
// import { useAuthStore } from "../../stores/authStore";

// const AdminSubscriptionsPage = () => {
//   const {
//     plans,
//     fetchPlans,
//     updatePlan,
//     subscriptionLoading,
//     subscriptionError,
//   } = useAuthStore();

//   const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
//   const [form, setForm] = useState({
//     price: 0,
//     duration: "",
//     maxProperties: null as number | null,
//   });

//   useEffect(() => {
//     fetchPlans();
//   }, [fetchPlans]);

//   const startEdit = (plan: any) => {
//     setEditingPlanId(plan.id);
//     setForm({
//       price: plan.price,
//       duration: plan.duration,
//       maxProperties: plan.maxProperties,
//     });
//   };

//   const cancelEdit = () => {
//     setEditingPlanId(null);
//   };

//   const saveEdit = async (planId: string) => {
//     await updatePlan(planId, form);
//     setEditingPlanId(null);
//   };

//   if (subscriptionLoading) {
//     return <div className="p-6">Loading plans...</div>;
//   }

//   if (subscriptionError) {
//     return <div className="p-6 text-red-500">{subscriptionError}</div>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Subscription Plans</h1>

//       <div className="overflow-x-auto bg-slate-900 rounded-xl shadow">
//         <table className="w-full text-sm text-left text-slate-300">
//           <thead className="bg-slate-800 text-slate-200">
//             <tr>
//               <th className="p-4">Plan</th>
//               <th className="p-4">Price</th>
//               <th className="p-4">Duration</th>
//               <th className="p-4">Max Properties</th>
//               <th className="p-4 text-right">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {plans.map((plan) => {
//               const isEditing = editingPlanId === plan.id;

//               return (
//                 <tr key={plan.id} className="border-t border-slate-800">
//                   <td className="p-4 font-medium">{plan.name}</td>

//                   <td className="p-4">
//                     {isEditing ? (
//                       <input
//                         type="number"
//                         value={form.price}
//                         onChange={(e) =>
//                           setForm({ ...form, price: Number(e.target.value) })
//                         }
//                         className="bg-slate-800 border border-slate-700 rounded px-2 py-1 w-24"
//                       />
//                     ) : (
//                       `₹ ${plan.price}`
//                     )}
//                   </td>

//                   <td className="p-4">
//                     {isEditing ? (
//                       <input
//                         value={form.duration}
//                         onChange={(e) =>
//                           setForm({ ...form, duration: e.target.value })
//                         }
//                         className="bg-slate-800 border border-slate-700 rounded px-2 py-1 w-32"
//                       />
//                     ) : (
//                       plan.duration
//                     )}
//                   </td>

//                   <td className="p-4">
//                     {isEditing ? (
//                       <input
//                         type="number"
//                         value={form.maxProperties ?? ""}
//                         onChange={(e) =>
//                           setForm({
//                             ...form,
//                             maxProperties: e.target.value
//                               ? Number(e.target.value)
//                               : null,
//                           })
//                         }
//                         className="bg-slate-800 border border-slate-700 rounded px-2 py-1 w-24"
//                       />
//                     ) : (
//                       plan.maxProperties ?? "Unlimited"
//                     )}
//                   </td>

//                   <td className="p-4 text-right space-x-2">
//                     {isEditing ? (
//                       <>
//                         <button
//                           onClick={() => saveEdit(plan.id)}
//                           className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
//                         >
//                           Save
//                         </button>
//                         <button
//                           onClick={cancelEdit}
//                           className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600"
//                         >
//                           Cancel
//                         </button>
//                       </>
//                     ) : (
//                       <button
//                         onClick={() => startEdit(plan)}
//                         className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
//                       >
//                         Edit
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {plans.length === 0 && (
//           <div className="p-6 text-center text-slate-400">
//             No subscription plans found.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminSubscriptionsPage;


// src/pages/admin/AdminSubscriptionsPage.tsx
import { useEffect, useState } from "react";
import ModernAdminLayout from "../../layouts/admin/AdminLayout";
import { useAuthStore } from "../../stores/authStore";

const AdminSubscriptionsPage = () => {
  const {
    plans,
    fetchPlans,
    updatePlan,
    subscriptionLoading,
    subscriptionError,
  } = useAuthStore();

  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [form, setForm] = useState({
    price: 0,
    duration: "",
    maxProperties: null as number | null,
  });

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const startEdit = (plan: any) => {
    setEditingPlanId(plan.id);
    setForm({
      price: plan.price,
      duration: plan.duration,
      maxProperties: plan.maxProperties,
    });
  };

  const cancelEdit = () => {
    setEditingPlanId(null);
  };

  const saveEdit = async (planId: string) => {
    await updatePlan(planId, form);
    setEditingPlanId(null);
  };

  if (subscriptionLoading) {
    return (
      <ModernAdminLayout>
        <p className="text-center mt-10">Loading plans...</p>
      </ModernAdminLayout>
    );
  }

  if (subscriptionError) {
    return (
      <ModernAdminLayout>
        <p className="text-center mt-10 text-red-500">
          {subscriptionError}
        </p>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-muted-foreground mt-1">
            Manage pricing and limits for each plan
          </p>
        </div>

        {/* Table Wrapper */}
        <div className="bg-slate-900 rounded-xl shadow overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm text-left text-slate-300">
            <thead className="bg-slate-800 text-slate-200">
              <tr>
                <th className="p-4">Plan</th>
                <th className="p-4">Price</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Max Properties</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {plans.map((plan) => {
                const isEditing = editingPlanId === plan.id;

                return (
                  <tr key={plan.id} className="border-t border-slate-800">
                    <td className="p-4 font-medium">{plan.name}</td>

                    <td className="p-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={form.price}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              price: Number(e.target.value),
                            })
                          }
                          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 w-24"
                        />
                      ) : (
                        `₹ ${plan.price}`
                      )}
                    </td>

                    <td className="p-4">
                      {isEditing ? (
                        <input
                          value={form.duration}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              duration: e.target.value,
                            })
                          }
                          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 w-32"
                        />
                      ) : (
                        plan.duration
                      )}
                    </td>

                    <td className="p-4">
                      {isEditing ? (
                        <input
                          type="number"
                          value={form.maxProperties ?? ""}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              maxProperties: e.target.value
                                ? Number(e.target.value)
                                : null,
                            })
                          }
                          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 w-24"
                        />
                      ) : (
                        plan.maxProperties ?? "Unlimited"
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEdit(plan.id)}
                            className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(plan)}
                          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {plans.length === 0 && (
            <div className="p-6 text-center text-slate-400">
              No subscription plans found.
            </div>
          )}
        </div>
      </div>
    </ModernAdminLayout>
  );
};

export default AdminSubscriptionsPage;
