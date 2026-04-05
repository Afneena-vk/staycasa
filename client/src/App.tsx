
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Suspense, lazy } from "react";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/error/ErrorBoundary.tsx";

import ProtectedRoute from "./components/routes/ProtectedRoute.tsx";
import PublicRoute from "./components/routes/PublicRoute";
import SessionManager from "./components/routes/SessionManager.tsx";
import NotFound from "./components/common/NotFound.tsx";
//import ErrorBoundary from "./components/common/ErrorBoundary.tsx";
import UserChatPage from "./pages/user/ChatPage";

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
const AdminSubscription = lazy(()=>import("./pages/admin/AdminSubscription.tsx"));
const AdminAllSubscriptionsPage = lazy(()=>import("./pages/admin/AdminAllSubscriptionsPage.tsx"));
const AdminLayout = lazy(() => import("./layouts/admin/AdminLayout"));

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
//const OwnerChatWindow = lazy(() => import("./pages/owner/OwnerChatWindow"));
const OwnerChatPage = lazy(() => import("./pages/owner/OwnerChatPage"));
const OwnerLayout = lazy(() => import("./layouts/owner/OwnerLayout.tsx"));

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
// const ChatWindow = lazy(() => import("./pages/user/ChatWindow"));
//const ChatWindow = lazy(() => import("./pages/user/ChatPage"));
const UserLayout = lazy(() => import("./layouts/user/UserLayout"));
const About = lazy(() => import("./pages/user/AboutPage.tsx"));
const Contact = lazy(() => import("./pages/user/Contact.tsx"));

const App = () => {
  return (
    <ErrorBoundary>
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
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />

              <Route path="users" element={<UserManagement />} />
              <Route path="users/:userId" element={<UserDetails />} />

              <Route path="owners" element={<OwnerManagement />} />
              <Route path="owners/:ownerId" element={<OwnerDetails />} />

              <Route path="properties" element={<AdminProperties />} />
              <Route
                path="properties/:propertyId"
                element={<AdminPropertyDetails />}
              />

              <Route path="bookings" element={<AdminBookings />} />
              <Route
                path="bookings/:bookingId"
                element={<AdminBookingDetails />}
              />

              <Route path="subscriptions" element={<AdminSubscription />} />
              <Route
                path="subscriptions/all"
                element={<AdminAllSubscriptionsPage />}
              />
            </Route>

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
            <Route
              path="/owner/otp-verification"
              element={<OwnerOTPVerification />}
            />
            <Route
              path="/owner/reset-password"
              element={
                <PublicRoute restrictedFor={["owner"]}>
                  <OwnerResetPassword />
                </PublicRoute>
              }
            />

            <Route
              path="/owner"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <OwnerLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<OwnerDashboard />} />

              <Route path="profile" element={<OwnerProfile />} />

              <Route path="properties" element={<OwnerProperties />} />
              <Route path="add-property" element={<OwnerAddProperty />} />
              <Route
                path="properties/:propertyId"
                element={<OwnerPropertyDetails />}
              />
              <Route
                path="properties/:propertyId/edit"
                element={<OwnerEditProperty />}
              />

              <Route path="wallet" element={<OwnerWallet />} />

              <Route path="bookings" element={<OwnerBookings />} />
              <Route
                path="bookings/:bookingId"
                element={<OwnerBookingDetails />}
              />

              <Route path="subscription" element={<OwnerSubscription />} />

              <Route path="chat" element={<OwnerChatPage />} />
              <Route
                path="chat/:propertyId/:userId"
                element={<OwnerChatPage />}
              />
            </Route>

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
            <Route
              path="/user/otp-verification"
              element={<UserOTPVerification />}
            />
            <Route
              path="/user/reset-password"
              element={
                <PublicRoute restrictedFor={["user"]}>
                  <UserResetPassword />
                </PublicRoute>
              }
            />
            <Route path="/user/auth-success" element={<AuthSuccess />} />

            <Route path="/user" element={<UserLayout />}>
              <Route path="dashboard" element={<UserLanding />} />

              <Route
                path="profile"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <UserProfile />
                  </ProtectedRoute>
                }
              />

              <Route path="properties" element={<ActivePropertiesUser />} />
              <Route
                path="properties/:propertyId"
                element={<UserPropertyDetails />}
              />

              <Route
                path="checkout/:propertyId"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="payment"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="booking-success"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <BookingSuccess />
                  </ProtectedRoute>
                }
              />

              <Route
                path="booking-failure"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <BookingFailure />
                  </ProtectedRoute>
                }
              />

              <Route
                path="bookings"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <BookingList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="bookings/:bookingId"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <BookingDetails />
                  </ProtectedRoute>
                }
              />

              <Route path="destination" element={<Destination />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />

              <Route
                path="wallet"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <UserWallet />
                  </ProtectedRoute>
                }
              />

              <Route
                path="bookings/:bookingId/review"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <ReviewPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="chat/:propertyId/:ownerId"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <UserChatPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
