
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { AuthType } from "../../stores/slices/authSlice";
import { useEffect } from "react";  

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: AuthType[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, authType } = useAuthStore();
  const location = useLocation();

    useEffect(() => {
    console.log(" ProtectedRoute Check:", {
      isAuthenticated,
      authType,
      allowedRoles,
      currentPath: location.pathname
    });
  }, [isAuthenticated, authType, allowedRoles, location.pathname]);

  if (!isAuthenticated || !authType) {
    console.log(" Not authenticated, redirecting to login");
    
    const redirectPath = allowedRoles.includes("admin") 
      ? "/admin/login" 
      : allowedRoles.includes("owner")
      ? "/owner/login"
      : "/user/login";
    
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(authType)) {
   
    return <Navigate to={`/${authType}/dashboard`} replace />;
  }
 console.log(" Access granted")
  return <>{children}</>;
};

export default ProtectedRoute;