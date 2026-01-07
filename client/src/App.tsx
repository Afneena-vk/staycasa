

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
import OwnerWallet from "./pages/owner/OwnerWallet.tsx";
import OwnerBookings from "./pages/owner/OwnerBookingList.tsx";
import OwnerBookingDetails from "./pages/owner/OwnerBookingDetails.tsx";

import UserSignup from "./pages/user/UserSignup";
import UserLogin from "./pages/user/UserLogin";
import UserForgotPassword from "./pages/user/UserForgotPassword";
import UserOTPVerification from "./pages/user/UserOTPverification";
import UserResetPassword from "./pages/user/UserResetPassword";
import UserLanding from "./pages/user/UserLanding.tsx";
import UserProfile from "./components/User/UserProfile.tsx";
import UserWallet from "./pages/user/UserWallet.tsx";
import ActivePropertiesUser from "./pages/user/ActivePropertiesUser.tsx";
import UserPropertyDetails from "./pages/user/UserPropertyDetails.tsx";
import Checkout from "./pages/user/Checkout.tsx"
import PaymentPage from "./pages/user/Payment.tsx";
import BookingSuccess from "./pages/user/BookingSuccess.tsx";
import BookingFailure from "./pages/user/BookingFailure.tsx";
import BookingList from "./pages/user/BookingList.tsx";
import BookingDetails from "./pages/user/BookingDetails.tsx";
import Destination from "./pages/user/Destination.tsx";

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

        <Route
          path="/owner/wallet"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerWallet/>
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/owner/bookings"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerBookings/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/owner/bookings/:bookingId"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerBookingDetails/>
            </ProtectedRoute>
          }
        />

        {/* <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/forgot-password" element={<UserForgotPassword />} />
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

         <Route
          path="/user/checkout/:propertyId"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/payment"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

      <Route
          path="/user/booking-success"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <BookingSuccess />
            </ProtectedRoute>
          }
        />

          <Route
          path="/user/booking-failure"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <BookingFailure />
            </ProtectedRoute>
          }
        />
          <Route
          path="/user/bookings"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <BookingList />
            </ProtectedRoute>
          }
        />
         <Route
          path="/user/bookings/:bookingId"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <BookingDetails />
            </ProtectedRoute>
          }
        />

          <Route
          path="/user/destination"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Destination />
            </ProtectedRoute>
          }
        />       


          <Route
          path="/user/wallet"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserWallet />
            </ProtectedRoute>
          }
        /> 


      </Routes>
    </Router>
  );
};

export default App;
