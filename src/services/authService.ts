import { supabase } from '../lib/supabase';
import { NDISUser } from '../types/ndis';
import { rateLimitService, RATE_LIMITS } from './rateLimitService';
import { productionConfigService } from './productionConfigService';

// Helper function to parse Supabase error messages
function parseSupabaseErrorMessage(error: any): string {
  if (error?.message) {
    // Try to parse nested JSON error messages
    try {
      if (typeof error.message === 'string' && error.message.includes('{"')) {
        const jsonMatch = error.message.match(/\{.*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return parsed.message || error.message;
        }
      }
      return error.message;
    } catch {
      return error.message;
    }
  }
  return 'An unexpected error occurred';
}

// Demo mode: only allowed in non-production environments
const DEMO_MODE = !supabase && !productionConfigService.isProduction();

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'participant' | 'support_worker';
  phone?: string;
}

interface AuthResponse {
  user: NDISUser;
  token: string;
  refreshToken: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Check rate limiting
    const loginKey = `login:${credentials.email}`;
    if (!rateLimitService.isAllowed(loginKey, RATE_LIMITS.LOGIN.maxRequests, RATE_LIMITS.LOGIN.windowMs)) {
      const resetTime = rateLimitService.getResetTime(loginKey);
      throw new Error(`Too many login attempts. Please try again in ${resetTime} seconds.`);
    }

    // Check for demo credentials first
    const demoEmails = ['admin@nurova.com.au', 'participant@nurova.com.au', 'worker@nurova.com.au', 'sarah.johnson@example.com', 'michael.thompson@example.com', 'emma.davis@example.com', 'alex.martinez@example.com', 'james.williams@example.com'];
    if (demoEmails.includes(credentials.email) && DEMO_MODE) {
      return this.demoLogin(credentials);
    }

    // In production, require real Supabase authentication
    if (productionConfigService.isProduction() && demoEmails.includes(credentials.email)) {
      throw new Error('Demo credentials are not available in production. Please use your registered account.');
    }

    try {
      if (DEMO_MODE || !supabase) {
        return this.demoLogin(credentials);
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from login');

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error('User profile not found');

      const user: NDISUser = {
        id: authData.user.id,
        email: authData.user.email!,
        role: profile.role,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        is_active: profile.is_active,
        email_verified: authData.user.email_confirmed_at !== null,
        created_at: new Date(profile.created_at),
        updated_at: new Date(profile.updated_at)
      };

      return {
        user,
        token: authData.session?.access_token || '',
        refreshToken: authData.session?.refresh_token || ''
      };
    } catch (error) {
      const errorMessage = parseSupabaseErrorMessage(error);
      console.warn('Supabase login failed:', errorMessage);
      // Fall back to demo mode if Supabase authentication fails
      if (error instanceof Error && 
          (error.message.includes('Failed to fetch') || 
           error.message.includes('network') ||
           error.name === 'AuthRetryableFetchError')) {
        return this.demoLogin(credentials);
      }
      throw new Error(errorMessage);
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    // Check rate limiting
    const registerKey = `register:${userData.email}`;
    if (!rateLimitService.isAllowed(registerKey, RATE_LIMITS.REGISTER.maxRequests, RATE_LIMITS.REGISTER.windowMs)) {
      const resetTime = rateLimitService.getResetTime(registerKey);
      throw new Error(`Too many registration attempts. Please try again in ${resetTime} seconds.`);
    }

    try {
      if (DEMO_MODE || !supabase) {
        return this.demoRegister(userData);
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from registration');

      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          role: userData.role,
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          is_active: true,
          profile_complete: false,
          onboarding_completed: false
        })
        .select()
        .single();

      if (profileError) throw profileError;

      const user: NDISUser = {
        id: authData.user.id,
        email: authData.user.email!,
        role: profile.role,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        is_active: profile.is_active,
        email_verified: authData.user.email_confirmed_at !== null,
        created_at: new Date(profile.created_at),
        updated_at: new Date(profile.updated_at)
      };

      return {
        user,
        token: authData.session?.access_token || '',
        refreshToken: authData.session?.refresh_token || ''
      };
    } catch (error) {
      const errorMessage = parseSupabaseErrorMessage(error);
      console.warn('Supabase registration failed:', errorMessage);
      // Fall back to demo mode if Supabase registration fails
      if (error instanceof Error && 
          (error.message.includes('Failed to fetch') || 
           error.message.includes('network') ||
           error.name === 'AuthRetryableFetchError')) {
        return this.demoRegister(userData);
      }
      throw new Error(errorMessage);
    }
  }

  async getCurrentUser(): Promise<NDISUser | null> {
    if (DEMO_MODE || !supabase) {
      return this.getDemoUser();
    }

    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError) {
        // Handle auth errors gracefully
        console.warn('Auth error (normal when not logged in):', authError.message);
        return null;
      }
      if (!authUser) return null;

      // Get user profile
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id);

      // Handle case where profile doesn't exist (PGRST116 error)
      if (profileError) {
        console.warn('Profile fetch error (normal for new users):', profileError.message);
        return null;
      }
      
      // Handle no profile found
      if (!profiles || profiles.length === 0) {
        return {
          id: authUser.id,
          email: authUser.email!,
          role: 'participant',
          first_name: 'New',
          last_name: 'User',
          phone: null,
          is_active: true,
          email_verified: authUser.email_confirmed_at !== null,
          created_at: new Date(authUser.created_at!),
          updated_at: new Date(authUser.updated_at!)
        };
      }
      
      const profile = profiles[0];

      return {
        id: authUser.id,
        email: authUser.email!,
        role: profile.role,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        is_active: profile.is_active,
        email_verified: authUser.email_confirmed_at !== null,
        created_at: new Date(profile.created_at),
        updated_at: new Date(profile.updated_at)
      };
    } catch (error) {
      console.warn('Get current user error (falling back to demo):', error);
      // If there's any network or configuration error, fall back to demo mode
      if (error instanceof Error && 
          (error.message.includes('Failed to fetch') || 
           error.message.includes('network') ||
           error.name === 'AuthRetryableFetchError')) {
        return this.getDemoUser();
      }
      return null;
    }
  }

  async logout(): Promise<void> {
    if (DEMO_MODE || !supabase) {
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  }

  async updateProfile(userId: string, updates: Partial<any>): Promise<void> {
    if (DEMO_MODE || !supabase) {
      // Simulate update for demo mode by updating localStorage
      const demoUser = this.getDemoUser();
      if (demoUser && demoUser.id === userId) {
        const updatedDemoUser = {
          ...demoUser,
          ...updates,
          updated_at: new Date().toISOString() // Ensure updated_at is a string for JSON.parse/stringify
        };
        localStorage.setItem('demo-auth-session', JSON.stringify(updatedDemoUser));
      }
      return; // Exit after simulating update
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error('Profile update failed');
    }
  }

  // Demo mode methods for when Supabase isn't configured
  private async demoLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Validate demo credentials
    if (credentials.password !== 'password123') {
      throw new Error('Invalid login credentials');
    }
    
    // Create different demo users based on email
    let demoUser: NDISUser;
    
    if (credentials.email === 'admin@nurova.com.au') {
      demoUser = {
        id: 'admin-user-id',
        email: credentials.email,
        role: 'admin',
        first_name: 'Admin',
        last_name: 'User',
        phone: '1800687682',
        is_active: true,
        email_verified: true,
        profile_complete: true,
        onboarding_completed: true,
        created_at: new Date(),
        updated_at: new Date()
      };
    } else if (credentials.email === 'participant@nurova.com.au') {
      demoUser = {
        id: 'participant-user-id',
        email: credentials.email,
        role: 'participant',
        first_name: 'Sarah',
        last_name: 'Johnson',
        phone: '0400123456',
        is_active: true,
        email_verified: true,
        profile_complete: true,
        onboarding_completed: true,
        created_at: new Date(),
        updated_at: new Date()
      };
    } else if (credentials.email === 'worker@nurova.com.au') {
      demoUser = {
        id: 'worker-user-id',
        email: credentials.email,
        role: 'support_worker',
        first_name: 'Michael',
        last_name: 'Thompson',
        phone: '0400567890',
        is_active: true,
        email_verified: true,
        profile_complete: true,
        onboarding_completed: true,
        created_at: new Date(),
        updated_at: new Date()
      };
    } else {
      // Default demo user
      demoUser = {
        id: 'demo-user-id',
        email: credentials.email,
        role: 'participant',
        first_name: 'Demo',
        last_name: 'User',
        phone: '0400 000 000',
        is_active: true,
        email_verified: true,
        profile_complete: false,
        onboarding_completed: false,
        created_at: new Date(),
        updated_at: new Date()
      };
    }
    localStorage.setItem('demo-auth-session', JSON.stringify(demoUser));
    
    return {
      user: demoUser,
      token: 'demo-token',
      refreshToken: 'demo-refresh-token'
    };
  }
  
  private async demoRegister(userData: RegisterData): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const demoUser: NDISUser = {
      id: 'demo-user-' + Date.now(),
      email: userData.email,
      role: userData.role,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone || null,
      is_active: true,
      email_verified: true,
      profile_complete: false,
      onboarding_completed: false,
      created_at: new Date(),
      updated_at: new Date()
    };
    localStorage.setItem('demo-auth-session', JSON.stringify(demoUser));
    
    return {
      user: demoUser,
      token: 'demo-token',
      refreshToken: 'demo-refresh-token'
    };
  }
  
  private getDemoUser(): NDISUser | null {
    const demoSession = localStorage.getItem('demo-auth-session');
    if (demoSession) {
      try {
        const user = JSON.parse(demoSession);
        if (user.created_at && typeof user.created_at === 'string') {
          user.created_at = new Date(user.created_at);
        }
        if (user.updated_at && typeof user.updated_at === 'string') {
          user.updated_at = new Date(user.updated_at);
        }
        return user;
      } catch (error) {
        console.error('Error parsing demo user:', error);
        localStorage.removeItem('demo-auth-session');
      }
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('supabase.auth.token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
export default authService;