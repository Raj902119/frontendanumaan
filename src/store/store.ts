import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import portfolioReducer from './features/portfolioSlice';
import userReducer from './features/userSlice';
import referralReducer from './features/referralSlice';
import eventsReducer from './features/eventsSlice';
import orderReducer from './features/orderSlice';
import walletReducer from './features/walletSlice';
import { authMiddleware } from './middleware/authMiddleware';

// Custom middleware to save auth state to localStorage
const localStorageMiddleware = ({ getState }: any) => {
  return (next: any) => (action: any) => {
    const result = next(action);
    const { auth } = getState();
    
    if (auth.isAuthenticated) {
      localStorage.setItem('auth', JSON.stringify({
        isAuthenticated: auth.isAuthenticated,
        token: auth.token,
        user: auth.user
      }));
    }
    
    return result;
  };
};

// Load persisted auth state
const loadAuthState = () => {
  try {
    const serializedAuth = localStorage.getItem('auth');
    if (serializedAuth === null) return undefined;
    return JSON.parse(serializedAuth);
  } catch (err) {
    return undefined;
  }
};

const preloadedState = {
  auth: loadAuthState() || {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    portfolio: portfolioReducer,
    user: userReducer,
    referral: referralReducer,
    events: eventsReducer,
    order: orderReducer,
    wallet: walletReducer
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 