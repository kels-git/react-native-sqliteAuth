// src/store/slices/auth-slice.ts
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthService, AuthUser} from 'src/services/api/auth-service';
import {generateToken} from 'src/utils/token-utils';

const STORAGE_KEYS = {
  ACCESS_TOKEN: '@access_token',
  USER_DATA: '@user_data',
  IS_LOGGED_IN: '@is_logged_in',
};

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const initializeAuth = createAsyncThunk<
  {user: AuthUser | null; token: string | null; isAuthenticated: boolean},
  void,
  {rejectValue: AuthError}
>('auth/initialize', async (_, {rejectWithValue}) => {
  try {
    console.log('🔄 Initializing auth state...');

    const [userData, token, isLoggedIn] = await AsyncStorage.multiGet([STORAGE_KEYS.USER_DATA, STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.IS_LOGGED_IN]);

    const user = userData[1] ? JSON.parse(userData[1]) : null;
    const storedToken = token[1];
    const authenticated = isLoggedIn[1] === 'true';

    console.log('✅ Auth state initialized:', {hasUser: !!user, hasToken: !!storedToken});

    return {
      user,
      token: storedToken,
      isAuthenticated: authenticated && !!user,
    };
  } catch (error: any) {
    console.error('Auth initialization failed:', error);
    return rejectWithValue({
      message: 'Failed to initialize authentication',
      code: 'INIT_ERROR',
    });
  }
});

export const loginWithEmail = createAsyncThunk<{user: AuthUser; token: string}, {email: string; password: string}, {rejectValue: AuthError}>(
  'auth/loginWithEmail',
  async ({email, password}, {rejectWithValue}) => {
    try {
      console.log('🔐 Attempting login for:', email);

      const user = await AuthService.login(email, password);
      const token = generateToken(user.id, user.email);

      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');

      console.log('✅ Login successful with token generated');

      return {user, token};
    } catch (error: any) {
      console.error('Login failed:', error);

      const authError: AuthError = {
        message: error?.message || 'Login failed. Please check your credentials.',
        code: 'LOGIN_ERROR',
      };

      return rejectWithValue(authError);
    }
  },
);

export const registerUser = createAsyncThunk<
  {user: AuthUser; token: string},
  {name: string; email: string; password: string},
  {rejectValue: AuthError}
>('auth/register', async ({name, email, password}, {rejectWithValue}) => {
  try {
    console.log('Registering new user:', email);

    const user = await AuthService.register(name, email, password);
    const token = generateToken(user.id, user.email);

    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');

    console.log('Registration successful with token generated');

    return {user, token};
  } catch (error: any) {
    console.error('Registration failed:', error);

    const authError: AuthError = {
      message: error?.message || 'Registration failed. Please try again.',
      code: 'REGISTER_ERROR',
    };

    return rejectWithValue(authError);
  }
});

export const getUserProfile = createAsyncThunk<AuthUser, void, {rejectValue: AuthError}>('auth/getUserProfile', async (_, {rejectWithValue}) => {
  try {
    console.log('Fetching user profile...');
    const user = await AuthService.getCurrentUser();

    if (!user) {
      throw new Error('No user found');
    }

    console.log('User profile fetched');
    return user;
  } catch (error: any) {
    console.error('Failed to fetch user profile:', error);

    const authError: AuthError = {
      message: error?.message || 'Failed to fetch user profile',
      code: 'PROFILE_ERROR',
    };

    return rejectWithValue(authError);
  }
});

export const logout = createAsyncThunk<void, void, {rejectValue: AuthError}>('auth/logout', async (_, {rejectWithValue}) => {
  try {
    console.log('👋 Logging out...');

    await AuthService.logout();
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);

    console.log('Logout successful');
  } catch (error: any) {
    console.error('Logout failed:', error);

    await AsyncStorage.multiRemove([STORAGE_KEYS.ACCESS_TOKEN, STORAGE_KEYS.USER_DATA, STORAGE_KEYS.IS_LOGGED_IN]);

    const authError: AuthError = {
      message: error?.message || 'Logout failed',
      code: 'LOGOUT_ERROR',
    };
    return rejectWithValue(authError);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = {...state.user, ...action.payload};
      }
    },
    resetAuth: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(initializeAuth.pending, state => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.isLoading = false;
        state.isInitialized = true;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error = action.payload || {message: 'Initialization failed'};
      });

    builder
      .addCase(loginWithEmail.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || {message: 'Login failed'};
        state.isAuthenticated = false;
      });

    builder
      .addCase(registerUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || {message: 'Registration failed'};
        state.isAuthenticated = false;
      });

    builder
      .addCase(getUserProfile.pending, state => {
        state.isLoading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || {message: 'Failed to fetch profile'};
      });

    builder
      .addCase(logout.pending, state => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.payload || {message: 'Logout failed'};
      });
  },
});

export const {clearError, updateUser, resetAuth} = authSlice.actions;
export default authSlice.reducer;
