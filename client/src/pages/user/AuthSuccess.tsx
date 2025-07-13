import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const AuthSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
  
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile`, {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user, 'user');
          navigate('/dashboard'); 
        } else {
          navigate('/user/login?error=auth_failed');
        }
      } catch (error) {
        console.error('Auth success error:', error);
        navigate('/user/login?error=auth_failed');
      }
    };

    handleAuthSuccess();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;