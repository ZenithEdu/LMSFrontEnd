// utils/auth.ts
import { jwtDecode } from 'jwt-decode';
import { JWTClaims } from '../types/auth.ts';
export const decodeToken = (token: string): JWTClaims | null => {
  try {
    return jwtDecode<JWTClaims>(token);
  } catch (error) {
    console.error('Invalid token format:', error);
    return null;
  }
};

export const getTokenClaims = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  return decodeToken(token);
};

// Check if token is valid and not expired
export const isValidSession = (): boolean => {
  const claims = getTokenClaims();
  if (!claims) return false;
  return Date.now() < claims.exp * 1000;
};

// Get user role safely
export const getUserRole = (): string | null => {
  const claims = getTokenClaims();
  return claims?.role || null;
};

// Check if user has specific role
export const hasRole = (role: string): boolean => {
  return getUserRole() === role;
};
