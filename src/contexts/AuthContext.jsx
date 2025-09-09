import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser, selectAuth } from '../store/slices/authSlice';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const auth = useSelector(selectAuth);

  useEffect(() => {
    // Check if user is logged in on app start
    if (auth.token && !auth.user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, auth.token, auth.user]);

  const value = {
    ...auth,
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    loading: auth.loading,
    error: auth.error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
