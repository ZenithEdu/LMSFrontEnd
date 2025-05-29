import { JWTClaims, User } from '../types/auth';
import config from '../config';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'lms_user';

export class AuthService {
  private static secretKey = config.JWT_SECRET_KEY;

  static setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  static setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static removeUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  static extractJWTClaims(token: string): JWTClaims | null {
    try {
      // Get the payload part of the JWT (second part)
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        console.error('Invalid token format');
        return null;
      }

      // Convert base64url to regular base64
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Decode base64 and parse JSON
      const payload = JSON.parse(
        decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )
      );

      return payload as JWTClaims;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  static isTokenValid(token: string): boolean {
    const claims = this.extractJWTClaims(token);
    if (!claims || !claims.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
    return claims.exp > currentTime;
  }

  static getTokenExpirationTime(token: string): Date | null {
    const claims = this.extractJWTClaims(token);
    if (!claims || !claims.exp) return null;
    return new Date(claims.exp * 1000);
  }

  static getUserFromToken(token: string): Partial<User> | null {
    const claims = this.extractJWTClaims(token);
    if (!claims) return null;

    return {
      id: claims.sub,
      email: claims.email,
      role: claims.role as 'admin' | 'manager' | 'student',
      name: claims.name
    };
  }

  static clearAuth(): void {
    this.removeToken();
    this.removeUser();
  }

  // This method can be used to check if the user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return this.isTokenValid(token);
  }

  // This method can be used to refresh the token if needed
  static async refreshToken(): Promise<string | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Here you would typically make an API call to refresh the token
      // For now, we'll just return the current token
      return token;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  static getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const claims = this.extractJWTClaims(token);
    return claims?.role || null;
  }

  static getSecretKey(): string {
    return this.secretKey;
  }

  static setSecretKey(key: string): void {
    this.secretKey = key;
  }

  static validateToken(token: string): boolean {
    try {
      if (!this.secretKey) {
        console.error('JWT secret key not set');
        return false;
      }

      if (!token) {
        return false;
      }

      const claims = this.extractJWTClaims(token);
      if (!claims) {
        return false;
      }

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (claims.exp && claims.exp < currentTime) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
}
