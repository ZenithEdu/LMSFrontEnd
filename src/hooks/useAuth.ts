import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  const handleRoleBasedRedirect = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        navigate('/admin');
        break;
      case 'manager':
        navigate('/manager');
        break;
      case 'student':
        navigate('/student');
        break;
      default:
        navigate('/login');
        break;
    }
  };

  const validateAndRedirect = () => {
    const token = AuthService.getToken();
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const claims = AuthService.extractJWTClaims(token);
      
      if (!claims) {
        toast.error('Invalid token');
        AuthService.clearAuth();
        navigate('/login');
        return;
      }

      // Check token expiration
      if (claims.exp && claims.exp * 1000 < Date.now()) {
        toast.error('Session expired. Please login again');
        AuthService.clearAuth();
        navigate('/login');
        return;
      }

      // Valid token, redirect based on role
      handleRoleBasedRedirect(claims.role);
      
    } catch (error) {
      console.error('Token validation error:', error);
      toast.error('Authentication error');
      AuthService.clearAuth();
      navigate('/login');
    }
  };

  return { validateAndRedirect, handleRoleBasedRedirect };
};
