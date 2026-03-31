import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { tokenService } from "../../utils/tokenService";
import { getCookie } from "../../utils/cookieUtils";

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  useEffect(() => {
    
    const csrfToken = getCookie("csrf-token");

    if (!csrfToken) {
      console.error("CSRF token missing after Google login");
      navigate("/user/login?error=csrf_missing");
      return;
    }

   
    tokenService.setCsrfToken(csrfToken);


    tokenService.setAuthType("user");


    setUser({ provider: "google" }, "user");

  
    navigate("/user/dashboard");
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;



