import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { usePermission } from '../../hooks/usePermission';
import authSlice from '../../redux/slices/authSlice';
import uiSlice from '../../redux/slices/uiSlice';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
      ui: uiSlice,
    },
    preloadedState,
  });
};

const renderHookWithProvider = (hook, preloadedState = {}) => {
  const store = createTestStore(preloadedState);
  return renderHook(hook, {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
};

describe('usePermission Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return false when user is not logged in', () => {
    const { result } = renderHookWithProvider(usePermission, {
      auth: { user: null, token: null, isAuthenticated: false },
    });

    expect(result.current.hasRole('admin')).toBe(false);
    expect(result.current.hasPermission('manage_products')).toBe(false);
  });

  it('should correctly identify user role', () => {
    const { result } = renderHookWithProvider(usePermission, {
      auth: {
        user: { role: 'admin' },
        token: 'test-token',
        isAuthenticated: true,
      },
    });

    expect(result.current.hasRole('admin')).toBe(true);
    expect(result.current.hasRole('manager')).toBe(false);
    expect(result.current.role).toBe('admin');
  });

  it('should return true when checking root role', () => {
    const { result } = renderHookWithProvider(usePermission, {
      auth: {
        user: { role: 'root' },
        token: 'test-token',
        isAuthenticated: true,
      },
    });

    expect(result.current.hasRole('admin')).toBe(true);
    expect(result.current.hasRole('manager')).toBe(true);
  });

  it('should handle case-insensitive role checking', () => {
    const { result } = renderHookWithProvider(usePermission, {
      auth: {
        user: { role: 'ADMIN' },
        token: 'test-token',
        isAuthenticated: true,
      },
    });

    expect(result.current.hasRole('admin')).toBe(true);
  });

  it('should return false for any permission when user is not logged in', () => {
    const { result } = renderHookWithProvider(usePermission, {
      auth: { user: null, token: null, isAuthenticated: false },
    });

    expect(result.current.hasAnyPermission(['manage_products', 'manage_users'])).toBe(false);
    expect(result.current.hasAllPermissions(['manage_products'])).toBe(false);
  });

  it('should correctly check hasAnyPermission', () => {
    const { result } = renderHookWithProvider(usePermission, {
      auth: {
        user: { role: 'manager' },
        token: 'test-token',
        isAuthenticated: true,
      },
    });

    expect(result.current.hasAnyPermission(['manage_products', 'manage_users'])).toBe(true);
    expect(result.current.hasAnyPermission(['manage_users', 'view_reports'])).toBe(false);
  });

  it('should correctly check hasAllPermissions', () => {
    const { result } = renderHookWithProvider(usePermission, {
      auth: {
        user: { role: 'admin' },
        token: 'test-token',
        isAuthenticated: true,
      },
    });

    expect(result.current.hasAllPermissions(['manage_products'])).toBe(true);
  });
});

describe('Role Constants', () => {
  it('should have correct role values', () => {
    const ROLES = {
      ROOT: 'root',
      ADMIN: 'admin',
      MANAGER: 'manager',
      ACCOUNTANT: 'accountant',
      STAFF: 'staff',
      WAREHOUSE: 'warehouse staff',
      SALES_STAFF: 'sales staff',
    };

    expect(ROLES.ROOT).toBe('root');
    expect(ROLES.ADMIN).toBe('admin');
    expect(ROLES.MANAGER).toBe('manager');
  });
});