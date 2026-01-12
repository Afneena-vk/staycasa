import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../stores/authStore";
import GoogleAuthButton from "../../components/GoogleAuthButton";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

   
    const newErrors = { email: "", password: "" };
    if (!formData.email.trim()) newErrors.email = "Please enter your email";
    if (!formData.password.trim()) newErrors.password = "Please enter your password";
    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;

    setIsLoading(true);

    try {
      await login(formData.email, formData.password, "user");
      toast.success("Login successful!");
      navigate("/user/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-28 px-4">
        <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">

          {/* Left Panel - Homestay Image + Branding */}
          <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-10 bg-white">
            <img
              src="/images/images.png" 
              alt="Homestay"
              className="w-auto max-w-full h-auto rounded-xl shadow-lg"
            />
            <h2 className="text-gray-900 text-2xl font-bold mt-6">STACASA</h2>
            <p className="text-gray-800 text-sm mt-2 text-center px-4">
              Find your perfect homestay for a short-term stay
            </p>
          </div>

          {/* Right Panel - Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
            <p className="text-gray-500 mb-6">Login to book your perfect vacation stay</p>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-gray-900"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                {/* <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  Remember me
                </label> */}
                <Link to="/user/forgot-password" className="text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition flex justify-center items-center gap-2"
              >
                {isLoading && <span className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></span>}
                {isLoading ? "Signing in..." : "Sign in"}
              </button>

              <div className="text-center text-sm text-gray-500 mt-3">
                Don't have an account?{" "}
                <Link to="/user/signup" className="text-blue-700 hover:underline">Sign up</Link>
              </div>

              <div className="flex items-center justify-center mt-4 gap-2">
                <div className="border-t border-gray-300 flex-grow"></div>
                <span className="text-sm text-gray-500">Or continue with</span>
                <div className="border-t border-gray-300 flex-grow"></div>
              </div>

              <GoogleAuthButton text="Sign in with Google" />
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserLogin;
