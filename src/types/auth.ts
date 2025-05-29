export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'student';
  batchId?: string;
  college?: string;
  branch?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'admin' | 'manager' | 'student';
    name: string;
    exp?: number;  // Expiration time
    iat?: number;  // Issued at
  };
}

export interface JWTClaims {
  id: number;          // Matches userPrincipal.getId()
  name: string;        // userPrincipal.getName()
  email: string;       // userPrincipal.getEmail()
  role: string;        // userPrincipal.getRole().name()
  userType: string;    // userPrincipal.getUserType()
  sub: string;         // Standard claim (userPrincipal.getEmail())
  iss: string;         // "LMSAuth"
  iat: number;         // Issued at timestamp
  exp: number;
}

export interface LoginError {
  message: string;
  statusCode?: number;
}

