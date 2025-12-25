export interface User {
    id: number;
    username: string;
    roles: 'ADMIN' | 'MANAGER' | 'STAFF';
    permissions:[]
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