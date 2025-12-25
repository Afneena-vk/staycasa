import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { tokenService } from "../../utils/tokenService";
import { useSessionChecker } from "../../hooks/useSessionChecker";

const SessionManager: React.FC = () => {
  const { isAuthenticated, authType, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

   useEffect(() => {
    console.log(" SessionManager State:", {
      isAuthenticated,
      authType,
      currentPath: location.pathname
    });
  }, [isAuthenticated, authType, location.pathname]);
  
  useSessionChecker();

  useEffect(() => {
   
    const storedAuthType = tokenService.getAuthType(); 

    console.log("Auth Sync Check:", {
      storeAuth: isAuthenticated,
      storeType: authType,
      storedType: storedAuthType
    });
    
    if (isAuthenticated && authType && !storedAuthType) {
         console.log("Setting auth type in tokenService");
      
      tokenService.setAuthType(authType);
    } else if (!isAuthenticated && storedAuthType) {
      
      console.log(" Clearing auth type from tokenService");

      tokenService.clearAuthType();
       tokenService.clearCsrfToken();
    }
  }, [isAuthenticated, authType]);

  
  useEffect(() => {
    if (!isAuthenticated || !authType) return;

    const authPages = ['/login', '/signup', '/forgot-password', '/reset-password'];
    const isOnAuthPage = authPages.some(page => location.pathname.includes(page));

    console.log(" Back button check:", {
      isOnAuthPage,
      currentPath: location.pathname
    });


    if (isOnAuthPage) {
      
      navigate(`/${authType}/dashboard`, { replace: true });
    }
  }, [location.pathname, isAuthenticated, authType, navigate]);

 

  return null; 
};

export default SessionManager;