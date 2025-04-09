import { configureStore } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer, 
  FLUSH, 
  REHYDRATE, 
  PAUSE, 
  PERSIST, 
  PURGE, 
  REGISTER 
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage for web
import { combineReducers } from 'redux';

import authReducer from './features/authSlice';
import portfolioReducer from './features/portfolioSlice';
import userReducer from './features/userSlice';
import referralReducer from './features/referralSlice';
import rankingsReducer from './features/rankingsSlice';
import ordersReducer from './features/orderSlice';

// Create a custom storage object that checks for browser environment
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    }
  };
};

// Use localStorage if in browser, otherwise use noop storage
const storageSystem = typeof window !== 'undefined' ? storage : createNoopStorage();

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage: storageSystem,
  // Don't persist these reducers
  blacklist: [],
  // Only persist these reducers (alternative to blacklist)
  // whitelist: ['auth', 'user', 'portfolio', 'referral']
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  portfolio: portfolioReducer,
  user: userReducer,
  referral: referralReducer,
  rankings: rankingsReducer,
  orders: ordersReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types to avoid serialization issues with persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 