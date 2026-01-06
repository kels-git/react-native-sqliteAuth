// src/services/auth/auth-service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser as loginUserDB, createUser as createUserDB } from '../database/database-service';

const USER_KEY = '@user_data';
const IS_LOGGED_IN_KEY = '@is_logged_in';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export class AuthService {

  static async login(email: string, password: string): Promise<AuthUser> {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const user = await loginUserDB(email, password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      const userData: AuthUser = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(IS_LOGGED_IN_KEY, 'true');
      
      console.log('Login successful');
      return userData;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  static async register(name: string, email: string, password: string): Promise<AuthUser> {
    try {
      console.log('Registering new user:', email);
      
      await createUserDB(name, email, password);
      console.log('User created in database');
      
      return await this.login(email, password);
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      if (error.message && error.message.includes('UNIQUE constraint failed')) {
        throw new Error('This email is already registered');
      }
      
      throw new Error('Registration failed. Please try again.');
    }
  }

  static async logout(): Promise<void> {
    try {
      console.log('👋 Logging out...');
      
      await AsyncStorage.multiRemove([USER_KEY, IS_LOGGED_IN_KEY]);
      
      console.log('Logout successful');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const isLoggedIn = await AsyncStorage.getItem(IS_LOGGED_IN_KEY);
      const user = await this.getCurrentUser();
      return isLoggedIn === 'true' && user !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Update user profile (optional)
   */
  static async updateCurrentUser(userData: Partial<AuthUser>): Promise<void> {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user is logged in');
      }

      const updatedUser = { ...currentUser, ...userData };
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      console.log('User profile updated');
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}