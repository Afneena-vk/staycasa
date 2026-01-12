

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/authStore';

type SignupFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  businessAddress: string;
};

const OwnerSignup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>();
  const navigate = useNavigate();
  const { signup, setTempEmail } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      await signup(data, 'owner');
      setTempEmail(data.email);
      toast.success('Registration successful! Please verify OTP sent to your email.');
      navigate('/owner/otp-verification');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      {/* <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"> */}
      <div className="flex w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">


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
       
       <div className="w-full md:w-1/2 p-8 md:p-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Owner Account</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Your Name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              {...register('phone', { required: 'Phone number is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Phone Number"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          {/* Business Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="businessName">Business Name</label>
            <input
              id="businessName"
              type="text"
              {...register('businessName', { required: 'Business name is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Business Name"
            />
            {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>}
          </div>

          {/* Business Address */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="businessAddress">Business Address</label>
            <input
              id="businessAddress"
              type="text"
              {...register('businessAddress', { required: 'Business address is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Business Address"
            />
            {errors.businessAddress && <p className="text-red-500 text-xs mt-1">{errors.businessAddress.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Minimum 8 characters' },
                 pattern: {
        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/,
        message: 'Must include a letter, number, and special character',
      },
              
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="********"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value, formValues) => value === formValues.password || 'Passwords do not match'
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="********"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
            disabled={isLoading}
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/owner/login" className="text-blue-500 hover:text-blue-700">Log in</a>
          </p>
        </div>
      </div>
    </div>
    </div>

  );
};

export default OwnerSignup;
