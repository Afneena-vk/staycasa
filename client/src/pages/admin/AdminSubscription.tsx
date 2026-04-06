
import { useEffect, useState } from "react";
//import ModernAdminLayout from "../../layouts/admin/AdminLayout";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";



interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  maxProperties: number | null;
}

const AdminSubscriptionsPage = () => {
  const {
    plans,
    fetchPlans,
    updatePlan,
    subscriptionLoading,
    subscriptionError,
  } = useAuthStore();

  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [errors, setErrors] = useState({
  price: "",
  duration: "",
  maxProperties: "",
});
  const [form, setForm] = useState({
    price: 0,
    duration: "",
    maxProperties: null as number | null,
  });
  const navigate = useNavigate();

  const validateForm = () => {
  const newErrors = {
    price: "",
    duration: "",
    maxProperties: "",
  };

  let isValid = true;

  if (!form.price || form.price <= 0) {
    newErrors.price = "Price must be greater than 0";
    isValid = false;
  }

  if (!form.duration.trim()) {
    newErrors.duration = "Duration is required";
    isValid = false;
  }

  if (form.maxProperties !== null && form.maxProperties <= 0) {
    newErrors.maxProperties = "Must be greater than 0";
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
};


  useEffect(() => {
    fetchPlans();
  // }, [fetchPlans]);
  }, []);

  // const startEdit = (plan: any) => {
  const startEdit = (plan: Plan) => {
    setEditingPlanId(plan.id);
    setForm({
      price: plan.price,
      duration: plan.duration,
      maxProperties: plan.maxProperties,
    });
  };

  // const cancelEdit = () => {
  //   setEditingPlanId(null);
  // };
  const cancelEdit = () => {
  setEditingPlanId(null);
  setErrors({
    price: "",
    duration: "",
    maxProperties: "",
  });
};

  const saveEdit = async (planId: string) => {
     if (!validateForm()) return;
    await updatePlan(planId, form);
    setEditingPlanId(null);
  };

  // if (subscriptionLoading) {
  //   return (
  //     <ModernAdminLayout>
  //       <p className="text-center mt-10">Loading plans...</p>
  //     </ModernAdminLayout>
  //   );
  // }
  {subscriptionLoading && (
  <div className="p-6 text-center text-slate-400">
    Loading plans...
  </div>
)}

  if (subscriptionError) {
    return (
      // <ModernAdminLayout>
        <p className="text-center mt-10 text-red-500">
          {subscriptionError}
        </p>
      // </ModernAdminLayout>
    );
  }

  return (
    // <ModernAdminLayout>
      <div className="space-y-6">
       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-muted-foreground mt-1">
            Manage pricing and limits for each plan
          </p>
        </div>
         <div className="flex justify-end">
          <button
            onClick={() => navigate("/admin/subscriptions/all")}
            className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-700 text-white text-sm w-full sm:w-auto"
          >
            View All Subscriptions
          </button>
        </div>
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
                         <div className="flex flex-col">
                        <input
                          type="number"
                          min="0" 
                          value={form.price}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              price: Number(e.target.value),
                            })
                          }
                          className="bg-slate-800 border border-slate-700 rounded px-2 py-1 w-24"
                        />
                              {errors.price && (
        <p className="text-red-500 text-xs mt-1">{errors.price}</p>
      )}
    </div>
                      ) : (
                        `₹ ${plan.price}`
                      )}
                    </td>

                    <td className="p-4">
                      {isEditing ? (
                        <div className="flex flex-col">
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
                              {errors.duration && (
        <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
      )}
    </div>

                      ) : (
                        plan.duration
                      )}
                    </td>

                    <td className="p-4">
                      {isEditing ? (
                        <div className="flex flex-col">

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
                             {errors.maxProperties && (
        <p className="text-red-500 text-xs mt-1">
          {errors.maxProperties}
        </p>
      )}
      </div>
                      ) : (
                        plan.maxProperties ?? "Unlimited"
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            disabled={subscriptionLoading}
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
                          className="px-3 py-1 rounded bg-blue-900 hover:bg-blue-700 text-white"
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
    // </ModernAdminLayout>
  );
};

export default AdminSubscriptionsPage;
