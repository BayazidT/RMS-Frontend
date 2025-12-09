export interface User {
    id: number;
    username: string;
    role: 'ADMIN' | 'MANAGER' | 'STAFF';
    // add more fields from your /profile response
  }
  
  export interface Tokens {
    accessToken: string;
    refreshToken: string;
  }
  
  export interface AuthState {
    user: User | null;
    tokens: Tokens | null;
    isAuthenticated: boolean;
  
    login: (tokens: Tokens) => Promise<void>;
    logout: () => void;
    refreshAccessToken: () => Promise<void>;
  }