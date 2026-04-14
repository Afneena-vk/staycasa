import { useState } from "react";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import { FaLock, FaSpinner, FaSave } from "react-icons/fa";
import { useAuthStore } from "../../stores/authStore";

import axios from "axios";
import ConfirmModal from "./ConfirmModal";

 const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
       error.response?.data?.error ||
      error.message ||
      "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};



const ChangePassword: React.FC = () => {
  const { userData, authType } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const validate = () => {

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return false;
    } 
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return false;
    }
  const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


    if (!passwordRegex.test(newPassword)) {
    toast.error(
      "Password must be at least 8 characters and include letter, number and special character"
    );
    return false;
  }

    if (currentPassword === newPassword) {
    toast.error("New password must be different from current password");
    return false;
  }


    return true;
  };


   const handleConfirmChange = async () => {
    if (!userData?.id) {
      toast.error("User not found");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.changePassword(
        {
          userId: userData.id,
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
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
      setShowModal(false); 
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setShowModal(true); 
  };


  return (
      <>
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
         {showModal && (
        <ConfirmModal
          title="Confirm Password Change"
          message="Are you sure you want to change your password?"
            isOpen={showModal} 
          onConfirm={handleConfirmChange}
          onCancel={() => setShowModal(false)}
        />
      )}
        </>
  );
};

export default ChangePassword;
