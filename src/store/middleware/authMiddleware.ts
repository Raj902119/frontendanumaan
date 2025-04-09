import { Middleware } from '@reduxjs/toolkit';

export const authMiddleware: Middleware = store => next => action => {
  const result = next(action);
  
  if (typeof action === 'object' && action !== null && 'type' in action && typeof action.type === 'string' && action.type.startsWith('auth/')) {
    const authState = store.getState().auth;
    if (authState.isAuthenticated) {
      localStorage.setItem('auth', JSON.stringify({
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        token: authState.token
      }));
    }
  }
  
  return result;
}; 