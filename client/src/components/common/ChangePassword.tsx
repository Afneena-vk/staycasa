import { useState } from "react";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import { FaLock, FaSpinner, FaSave } from "react-icons/fa";
import { useAuthStore } from "../../stores/authStore";
// interface ChangePasswordProps {
//   userId?: string; 
// }



const ChangePassword: React.FC = () => {
  const { userData, authType } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      toast.error("All fields are required");
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!userData?.id) {
      toast.error("User not found");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.changePassword({
        userId : userData.id,
        currentPassword,
        newPassword,
      },
      authType as "user" | "owner" 
    );

      if (response.status === 200) {
        toast.success(response.message || "Password changed successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          <FaLock className="inline mr-2" /> Current Password
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          <FaLock className="inline mr-2" /> New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          <FaLock className="inline mr-2" /> Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-950 text-white px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Changing...
            </>
          ) : (
            <>
              <FaSave />
              Change Password
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;
