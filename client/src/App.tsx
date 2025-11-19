

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/routes/ProtectedRoute.tsx";
import PublicRoute from "./components/routes/PublicRoute";
import SessionManager from "./components/routes/SessionManager.tsx";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import UserManagement from "./pages/admin/UserManagement.tsx";
import OwnerManagement from "./pages/admin/OwnerManagement.tsx";
import UserDetails from "./pages/admin/UserDetails.tsx";
import OwnerDetails from "./pages/admin/OwnerDetails.tsx";
import AdminProperties from "./pages/admin/AdminProperties.tsx";
import AdminPropertyDetails from "./pages/admin/AdminPropertyDetails.tsx";

import OwnerSignup from "./pages/owner/OwnerSignup";
import OwnerLogin from "./pages/owner/OwnerLogin.tsx";
import OwnerForgotPassword from "./pages/owner/OwnerForgotPassword.tsx";
import OwnerOTPVerification from "./pages/owner/OwnerOTPverification.tsx";
import OwnerResetPassword from "./pages/owner/OwnerResetPassword";
import AuthSuccess from "./pages/user/AuthSuccess.tsx";
import OwnerDashboard from "./pages/owner/OwnerDashboard.tsx";
import OwnerProperties from "./pages/owner/OwnerProperties.tsx";
import OwnerAddProperty from "./pages/owner/OwnerAddProperty.tsx";
import OwnerProfile from "./components/Owner/OwnerProfile.tsx";
import OwnerPropertyDetails from "./pages/owner/OwnerPropertyDetails.tsx"
import OwnerEditProperty from "./pages/owner/OwnerEditProperty.tsx";

import UserSignup from "./pages/user/UserSignup";
import UserLogin from "./pages/user/UserLogin";
import UserForgotPassword from "./pages/user/UserForgotPassword";
import UserOTPVerification from "./pages/user/UserOTPverification";
import UserResetPassword from "./pages/user/UserResetPassword";
import UserLanding from "./pages/user/UserLanding.tsx";
import UserProfile from "./components/User/UserProfile.tsx";
import ActivePropertiesUser from "./pages/user/ActivePropertiesUser.tsx";
import UserPropertyDetails from "./pages/user/UserPropertyDetails.tsx";

const App = () => {
  return (
    <Router>
      <SessionManager />
      <ToastContainer />
      <Routes>
         <Route
          path="/admin/login"
          element={
            <PublicRoute restrictedFor={["admin"]}>
              <AdminLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:userId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UserDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/owners"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <OwnerManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/owners/:ownerId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <OwnerDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/properties"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProperties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/properties/:propertyId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPropertyDetails />
            </ProtectedRoute>
          }
        />
        
        
        
        <Route
  path="/"
  element={
    <PublicRoute restrictedFor={["user", "owner"]}>
      <UserLanding />
    </PublicRoute>
  }
/>

          <Route
          path="/owner/signup"
          element={
            <PublicRoute restrictedFor={["owner"]}>
              <OwnerSignup />
            </PublicRoute>
          }
        />
        <Route
          path="/owner/login"
          element={
            <PublicRoute restrictedFor={["owner"]}>
              <OwnerLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/owner/forgot-password"
          element={
            <PublicRoute restrictedFor={["owner"]}>
              <OwnerForgotPassword />
            </PublicRoute>
          }
        />
        <Route path="/owner/otp-verification" element={<OwnerOTPVerification />} />
        <Route
          path="/owner/reset-password"
          element={
            <PublicRoute restrictedFor={["owner"]}>
              <OwnerResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/properties"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerProperties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/profile"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/add-property"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerAddProperty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/properties/:propertyId"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerPropertyDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/properties/:propertyId/edit"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerEditProperty />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/forgot-password" element={<UserForgotPassword />} />
        <Route path="/user/otp-verification" element={<UserOTPVerification />} />
        <Route path="/user/reset-password" element={<UserResetPassword />} />
        <Route path="/user/auth-success" element={<AuthSuccess />} />
        <Route path="/user/dashboard" element={<UserLanding />} />
        <Route path='/user/profile' element={<UserProfile/>}/>
         */}

                {/* User Routes */}
        <Route
          path="/user/signup"
          element={
            <PublicRoute restrictedFor={["user"]}>
              <UserSignup />
            </PublicRoute>
          }
        />
        <Route
          path="/user/login"
          element={
            <PublicRoute restrictedFor={["user"]}>
              <UserLogin />
            </PublicRoute>
          }
        />
        <Route
          path="/user/forgot-password"
          element={
            <PublicRoute restrictedFor={["user"]}>
              <UserForgotPassword />
            </PublicRoute>
          }
        />
        <Route path="/user/otp-verification" element={<UserOTPVerification />} />
        <Route
          path="/user/reset-password"
          element={
            <PublicRoute restrictedFor={["user"]}>
              <UserResetPassword />
            </PublicRoute>
          }
        />
        <Route path="/user/auth-success" element={<AuthSuccess />} />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserLanding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/properties"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <ActivePropertiesUser />
            </ProtectedRoute>
          }
        />
          <Route
          path="/user/properties/:propertyId"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserPropertyDetails />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
};

export default App;
