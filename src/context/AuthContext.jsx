import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);

/**
 * Provides authentication state and actions to the whole app.
 * Auth is handled in the browser (localStorage) — see authService.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, restore the logged-in user (if any) from localStorage.
  useEffect(() => {
    setUser(authService.getCurrentUser());
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (details) => {
    // We don't auto-login here — the user is redirected to Login afterwards.
    return authService.register(details);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Convenience hook to consume the auth context.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
