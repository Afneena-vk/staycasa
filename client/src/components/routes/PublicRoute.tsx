
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { AuthType } from "../../stores/slices/authSlice";
import { useEffect } from "react";

interface PublicRouteProps {
  children: React.ReactNode;
  restrictedFor?: AuthType[]; 
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  restrictedFor = ["user", "owner", "admin"] 
}) => {
  const { isAuthenticated, authType } = useAuthStore();

  useEffect(() => {
    console.log(" PublicRoute Check:", {
      isAuthenticated,
      authType,
      restrictedFor
    });
  }, [isAuthenticated, authType, restrictedFor]);

  // If user is authenticated and this route is restricted for their type
  if (isAuthenticated && authType && restrictedFor.includes(authType)) {
   
     console.log("✋ User is logged in, redirecting to dashboard");
    return <Navigate to={`/${authType}/dashboard`} replace />;
  }
  console.log(" Public access granted");
  return <>{children}</>;
};

export default PublicRoute;