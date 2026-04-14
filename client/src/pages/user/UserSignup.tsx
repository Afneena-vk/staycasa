

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/authStore';
import Header from '../../components/User/Header';
import Footer from '../../components/User/Footer';
import axios from 'axios';

type SignupFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const UserSignup = () => {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<SignupFormData>();

  const navigate = useNavigate();
  const { signup, setTempEmail } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);

     const cleanedData = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),

      password: data.password,
      confirmPassword: data.confirmPassword
    };

      // await signup(data, 'user');
      // setTempEmail(data.email); 
      await signup(cleanedData, 'user'); 
      setTempEmail(cleanedData.email);

      toast.success('Registration successful! Please verify OTP sent to your email.');
      navigate('/user/otp-verification');
    
      }  catch (error: unknown) {
  let message = "Registration failed";

  if (axios.isAxiosError(error)) {
    message =
      error.response?.data?.message ??
      error.message ??
      message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  toast.error(message);

    } finally {
      setIsLoading(false);
    }
  };

  return ( 
       <>
      <Header />
    <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-12 pb-10 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
       {/*  <h2 className="text-2xl font-bold mb-6 text-center">Create User Account</h2> */}
       <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-950 to-blue-800 bg-clip-text text-transparent">
  Create User Account
</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Name"
              
              {...register('name', {
  required: 'Name is required',
  minLength: {
    value: 3,
    message: 'Name must be at least 3 characters'
  },

    pattern: {
    value: /^[A-Za-z\s'.-]+$/,
    message: 'Only letters, spaces, ".", "-" and "\'" are allowed'
  },
  validate: (value) =>
    /[A-Za-z]/.test(value) || 'Enter a valid name'
})}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="enter mobile number"
              {...register('phone', { 
                required: 'Phone number is required',
                pattern: {
  value: /^[6-9]\d{9}$/,
  message: 'Enter a valid Indian phone number'
}
              })}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                 pattern: {
      // value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/,
         value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: 'Password must include a letter, number, and special character'
    }
              })}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                // validate: (value, formValues) => value === formValues.password || 'Passwords do not match'
                     validate: (value) =>
                    value === getValues('password') || 'Passwords do not match'
              })}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
          
          <button
            type="submit"
            className="w-full text-sm font-medium bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/user/login" className="text-blue-800 hover:text-blue-700 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
          <Footer />
    </>
  );
};

export default UserSignup;


