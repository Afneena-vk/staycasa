import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/authStore';

type OtpFormData = {
  otp: string;
};

const OwnerOTPVerification = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<OtpFormData>();
  const navigate = useNavigate();
  const { verifyOTP, resendOTP, tempEmail } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60); 
  const [timerActive, setTimerActive] = useState(true);

  const hasCheckedEmail = useRef(false);

  
  useEffect(() => {
    if (!hasCheckedEmail.current) {
      hasCheckedEmail.current = true;
      if (!tempEmail) {
        toast.error('Please complete signup first');
        navigate('/owner/signup');
      }
    }
  }, [tempEmail, navigate]);

 
  useEffect(() => {
    let interval: number | undefined;

    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, timerActive]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const onSubmit = async (data: OtpFormData) => {
    if (!tempEmail) {
      toast.error('Email not found. Please try again.');
      return;
    }

    try {
      setIsLoading(true);
      await verifyOTP(tempEmail, data.otp, 'owner');
      toast.success('OTP verified successfully!');
      navigate('/owner/login');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!tempEmail) {
      toast.error('Email not found. Please try signup again.');
      navigate('/owner/signup');
      return;
    }

    try {
      setIsResending(true);
      await resendOTP(tempEmail, 'owner');
      setTimer(60);
      setTimerActive(true);
      toast.success('New OTP has been sent to your email');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-center">OTP Verification</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to your email
          {tempEmail && <span className="font-medium block mt-1">{tempEmail}</span>}
        </p>

        {timerActive && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">
              OTP expires in <span className="font-medium">{formatTime(timer)}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
              OTP Code
            </label>
            <input
              id="otp"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-wider"
              maxLength={6}
              placeholder="123456"
              {...register('otp', {
                required: 'OTP is required',
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: 'OTP must be 6 digits'
                }
              })}
            />
            {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={isLoading || !timerActive}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>

          {!timerActive && (
            <p className="text-center text-red-500 text-sm mt-2">
              OTP has expired. Please request a new one.
            </p>
          )}
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive OTP?{' '}
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={handleResendOTP}
              // disabled={isResending || (timerActive && timer > 240)}
              disabled={isResending || timerActive}
            >
              {isResending ? 'Resending...' : 'Resend'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerOTPVerification;

