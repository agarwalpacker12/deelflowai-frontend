import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { authAPI } from '../../services/api';
import authReducer from '../../store/slices/authSlice';
import uiReducer from '../../store/slices/uiSlice';
import LoginPage from './LoginPage';

// Mock the authAPI
jest.mock('../../services/api', () => ({
  authAPI: {
    login: jest.fn(),
  },
}));

// Mock the useNavigate hook
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});

describe('LoginPage', () => {
  it('should render the login form', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should allow a user to log in', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });

    authAPI.login.mockResolvedValue({ data: { token: 'test-token', user: { name: 'Test User' } } });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(store.getState().auth.isAuthenticated).toBe(true);
      expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
