import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore'; 
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password, 'admin');
      navigate('/admin/dashboard'); 
    } catch (err: any) {
      setError('Invalid email or password');
    }
  };



  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">

        {/* LEFT SIDE – BRANDING */}
        <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-10 bg-white">
          <img
            src="/images/images.png"
            alt="STACASA Homestay"
            className="w-auto max-w-full h-auto rounded-xl shadow-lg"
          />
          <h2 className="text-gray-900 text-2xl font-bold mt-6">STACASA</h2>
          <p className="text-gray-700 text-sm mt-2 text-center px-4">
            Admin panel for managing properties and users
          </p>
        </div>

        {/* RIGHT SIDE – ADMIN LOGIN */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-10">
          <div className="w-full max-w-md">

            <h2 className="text-3xl font-extrabold text-gray-900 text-center">
              Admin Login
            </h2>
            <p className="text-sm text-gray-600 text-center mt-2">
              Sign in to access the admin dashboard
            </p>

            {error && (
              <p className="text-red-500 text-center mt-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="admin@email.com"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
              >
                Login
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;