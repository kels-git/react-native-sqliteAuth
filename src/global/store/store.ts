import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import authReducer from '../auth/auth-slice';
import {persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from 'redux-persist';

const rootPersistConfig = {
  key: 'reactnativesqliteauth',
  storage: AsyncStorage,
  whitelist: ['auth'],
};

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['tokens', 'user', 'isAuthenticated'],
  blacklist: ['isloading', 'error'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    const middleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'auth/loginWithEmail/fulfilled',
          'auth/registerUser/fulfilled',
          'auth/initializeAuth/fulfilled',
        ],
        ignoredPaths: ['auth.error', 'auth.lastActivity'], // Ignore timestamp fields
      },
    });

    // Logger for development
    if (__DEV__) {
      const logger = (store: any) => (next: any) => (action: any) => {
        const result = next(action);
        return result;
      };
      middleware.push(logger);
    }

    return middleware;
  },
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export {store, persistor};
export default store;
