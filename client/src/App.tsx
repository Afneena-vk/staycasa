
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Suspense, lazy } from "react";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/routes/ProtectedRoute.tsx";
import PublicRoute from "./components/routes/PublicRoute";
import SessionManager from "./components/routes/SessionManager.tsx";
import NotFound from "./components/common/NotFound.tsx";

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const OwnerManagement = lazy(() => import("./pages/admin/OwnerManagement"));
const UserDetails = lazy(() => import("./pages/admin/UserDetails"));
const OwnerDetails = lazy(() => import("./pages/admin/OwnerDetails"));
const AdminProperties = lazy(() => import("./pages/admin/AdminProperties"));
const AdminPropertyDetails = lazy(() => import("./pages/admin/AdminPropertyDetails"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminBookingDetails = lazy(() => import("./pages/admin/AdminBookingDetails"));
const AdminSubscription = lazy(()=>import("./pages/admin/AdminSubscription.tsx"))
const AdminAllSubscriptionsPage = lazy(()=>import("./pages/admin/AdminAllSubscriptionsPage.tsx"))

const OwnerSignup = lazy(() => import("./pages/owner/OwnerSignup"));
const OwnerLogin = lazy(() => import("./pages/owner/OwnerLogin"));
const OwnerForgotPassword = lazy(() => import("./pages/owner/OwnerForgotPassword"));
const OwnerOTPVerification = lazy(() => import("./pages/owner/OwnerOTPverification"));
const OwnerResetPassword = lazy(() => import("./pages/owner/OwnerResetPassword"));
const OwnerDashboard = lazy(() => import("./pages/owner/OwnerDashboard"));
const OwnerProperties = lazy(() => import("./pages/owner/OwnerProperties"));
const OwnerAddProperty = lazy(() => import("./pages/owner/OwnerAddProperty"));
const OwnerProfile = lazy(() => import("./components/Owner/OwnerProfile"));
const OwnerPropertyDetails = lazy(() => import("./pages/owner/OwnerPropertyDetails"));
const OwnerEditProperty = lazy(() => import("./pages/owner/OwnerEditProperty"));
const OwnerWallet = lazy(() => import("./pages/owner/OwnerWallet"));
const OwnerBookings = lazy(() => import("./pages/owner/OwnerBookingList"));
const OwnerBookingDetails = lazy(() => import("./pages/owner/OwnerBookingDetails"));
const OwnerSubscription = lazy(() => import("./pages/owner/OwnerSubscription"));


const UserSignup = lazy(() => import("./pages/user/UserSignup"));
const UserLogin = lazy(() => import("./pages/user/UserLogin"));
const UserForgotPassword = lazy(() => import("./pages/user/UserForgotPassword"));
const UserOTPVerification = lazy(() => import("./pages/user/UserOTPverification"));
const UserResetPassword = lazy(() => import("./pages/user/UserResetPassword"));
const AuthSuccess = lazy(() => import("./pages/user/AuthSuccess"));
const UserLanding = lazy(() => import("./pages/user/UserLanding"));
const UserProfile = lazy(() => import("./components/User/UserProfile"));
const UserWallet = lazy(() => import("./pages/user/UserWallet"));
const ActivePropertiesUser = lazy(() => import("./pages/user/ActivePropertiesUser"));
const UserPropertyDetails = lazy(() => import("./pages/user/UserPropertyDetails"));
const Checkout = lazy(() => import("./pages/user/Checkout"));
const PaymentPage = lazy(() => import("./pages/user/Payment"));
const BookingSuccess = lazy(() => import("./pages/user/BookingSuccess"));
const BookingFailure = lazy(() => import("./pages/user/BookingFailure"));
const BookingList = lazy(() => import("./pages/user/BookingList"));
const BookingDetails = lazy(() => import("./pages/user/BookingDetails"));
const Destination = lazy(() => import("./pages/user/Destination"));
const ReviewPage = lazy(() => import("./pages/user/ReviewPage"));


const App = () => {
  return (
    <Router>
      <SessionManager />
      <ToastContainer />
     <Suspense fallback={<LoadingFallback />}>
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
          path="/admin/bookings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminBookings/>
            </ProtectedRoute>
          }
        />       

 
         <Route
          path="/admin/bookings/:bookingId"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminBookingDetails/>
            </ProtectedRoute>
          }
        />        
        
       <Route
          path="/admin/subscriptions"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSubscription/>
            </ProtectedRoute>
          }
        />  

        <Route
          path="/admin/subscriptions/all"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAllSubscriptionsPage/>
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

        <Route
          path="/owner/subscription"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <OwnerSubscription/>
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
            // <ProtectedRoute allowedRoles={["user"]}>
              <UserLanding />
            // </ProtectedRoute>
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
            // <ProtectedRoute allowedRoles={["user"]}>
              <ActivePropertiesUser />
            // </ProtectedRoute>
          }
        />
          <Route
          path="/user/properties/:propertyId"
          element={
            // <ProtectedRoute allowedRoles={["user"]}>
              <UserPropertyDetails />
            // </ProtectedRoute>
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
            // <ProtectedRoute allowedRoles={["user"]}>
              <Destination />
            // </ProtectedRoute>
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

      <Route
          path="/user/bookings/:bookingId/review"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <ReviewPage/>
            </ProtectedRoute>
          }
        />



         <Route path="*" element={<NotFound />} />



      </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
