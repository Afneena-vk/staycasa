
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { api } from "../api/api";
import { toast } from "react-toastify";

export const useSessionChecker = () => {
  const { isAuthenticated, authType, logout, userData } = useAuthStore();
  const navigate = useNavigate();

const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const lastCheckRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isAuthenticated || !authType) {
      return;
    } 

    const checkUserStatus = async () => {
      try {
        // Only checking if enough time has passed (30 seconds)
        const now = Date.now();
        if (now - lastCheckRef.current < 30000) {
          return;
        }
        lastCheckRef.current = now;

        let endpoint = "";
        if (authType === "user") {
          endpoint = "/user/profile";
        } else if (authType === "owner") {
          endpoint = "/owner/profile";
        } else if (authType === "admin") {
          return; 
        }

        const response = await api.get(endpoint);

        
        if (authType === "user" && response.data.data?.status === "blocked") {
          toast.error("Your account has been blocked by the administrator");
          logout();
          navigate(`/${authType}/login`, { replace: true });
        } else if (authType === "owner" && response.data.data?.isBlocked === true) {
          toast.error("Your account has been blocked by the administrator");
          logout();
          navigate(`/${authType}/login`, { replace: true });
        }
      } catch (error: any) {
        
        if (error.response?.status === 401) {
          console.error("Session expired or invalid");
          logout();
          navigate(`/${authType}/login`, { replace: true });
        }
      }
    };

    
    checkUserStatus();

    
    checkIntervalRef.current = setInterval(checkUserStatus, 2 * 60 * 1000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [isAuthenticated, authType, logout, navigate, userData]);

  return null;
};