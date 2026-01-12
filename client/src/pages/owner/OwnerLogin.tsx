import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../stores/authStore";

const OwnerLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
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

     let newErrors = { email: "", password: "" };
    let hasError = false;

    
    if (!formData.email) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
      hasError = true;
    }

      if (!formData.password) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }



    setIsLoading(true);

    try {
      await login(formData.email, formData.password, "owner");
      toast.success("Login successful!");
      navigate("/owner/dashboard"); 
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">

      {/* LEFT SIDE – IMAGE / BRANDING */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-10 bg-white">
        <img
          src="/images/images.png"
          alt="STACASA Homestay"
          className="w-auto max-w-full h-auto rounded-xl shadow-lg"
        />
        <h2 className="text-gray-900 text-2xl font-bold mt-6">STACASA</h2>
        <p className="text-gray-700 text-sm mt-2 text-center px-4">
          List your property and start hosting guests from around the world
        </p>
      </div>

      {/* RIGHT SIDE – LOGIN FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-10">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Owner Login
          </h2>
          <p className="text-sm text-gray-600 text-center mt-2">
            Welcome back! Please sign in to your account
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                name="email"
                type="email"
               
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="owner@email.com"
              />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                name="password"
                type="password"
              
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">
              <Link
                to="/owner/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {/* SIGNUP */}
            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/owner/signup"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  </div>
);

};

export default OwnerLogin;

