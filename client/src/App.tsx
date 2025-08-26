

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import UserManagement from "./pages/admin/UserManagement.tsx";
import OwnerManagement from "./pages/admin/OwnerManagement.tsx";
import UserDetails from "./pages/admin/UserDetails.tsx";
import OwnerDetails from "./pages/admin/OwnerDetails.tsx";

import OwnerSignup from "./pages/owner/OwnerSignup";
import OwnerLogin from "./pages/owner/OwnerLogin.tsx";
import OwnerForgotPassword from "./pages/owner/OwnerForgotPassword.tsx";
import OwnerOTPVerification from "./pages/owner/OwnerOTPverification.tsx";
import OwnerResetPassword from "./pages/owner/OwnerResetPassword";
import AuthSuccess from "./pages/user/AuthSuccess.tsx";
import OwnerDashboard from "./pages/owner/OwnerDashboard.tsx";
import OwnerProperties from "./pages/owner/OwnerProperties.tsx";
import OwnerProfile from "./components/Owner/OwnerProfile.tsx";

import UserSignup from "./pages/user/UserSignup";
import UserLogin from "./pages/user/UserLogin";
import UserForgotPassword from "./pages/user/UserForgotPassword";
import UserOTPVerification from "./pages/user/UserOTPverification";
import UserResetPassword from "./pages/user/UserResetPassword";
import UserLanding from "./pages/user/UserLanding.tsx";
import UserProfile from "./components/User/UserProfile.tsx";

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/users/:userId"  element={<UserDetails />} />
        <Route path="/admin/owners" element={<OwnerManagement />} />
        <Route path="/admin/owners/:ownerId" element={<OwnerDetails />} />
        
        <Route path="/owner/signup" element={<OwnerSignup />} />
        <Route path="/owner/login" element={<OwnerLogin />} />
        <Route path="/owner/forgot-password" element={<OwnerForgotPassword />} />
        <Route path="/owner/otp-verification" element={<OwnerOTPVerification />} />
        <Route path="/owner/reset-password" element={<OwnerResetPassword />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard/>}/>
        <Route path="/owner/properties" element={<OwnerProperties/>}/>
        <Route path='/owner/profile' element={<OwnerProfile/>}/>
  
        <Route path="/user/signup" element={<UserSignup />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/forgot-password" element={<UserForgotPassword />} />
        <Route path="/user/otp-verification" element={<UserOTPVerification />} />
        <Route path="/user/reset-password" element={<UserResetPassword />} />
        <Route path="/user/auth-success" element={<AuthSuccess />} />
        <Route path="/user/dashboard" element={<UserLanding />} />
        <Route path='/user/profile' element={<UserProfile/>}/>
        
      </Routes>
    </Router>
  );
};

export default App;
