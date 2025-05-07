
import { useState, useEffect, createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sendLoginWebhook } from './webhooks';

export type AuthSession = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (provider: 'google' | 'email', options?: any) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthSession | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Get the current URL for redirect fallback
  const currentOrigin = window.location.origin;

  useEffect(() => {
    // Set up listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
        
        // Send webhook on sign_in event
        if (event === 'SIGNED_IN' && currentSession?.user) {
          await sendLoginWebhook(currentSession.user.id);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log('Current session check:', currentSession?.user?.email || 'No session');
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
      
      // If there's an existing session, send the webhook
      if (currentSession?.user) {
        await sendLoginWebhook(currentSession.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (provider: 'google' | 'email', options?: any) => {
    try {
      setIsLoading(true);
      
      if (provider === 'google') {
        const redirectTo = options?.redirectTo || `${currentOrigin}/home`;
        console.log('Google sign in with redirect to:', redirectTo);
        
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent'
            }
          }
        });
        // Note: Webhook will be triggered by onAuthStateChange when the OAuth flow completes
      } else if (provider === 'email' && options?.email && options?.password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: options.email,
          password: options.password
        });
        
        if (error) {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          
          // Call webhook after successful email login
          if (data?.user) {
            await sendLoginWebhook(data.user.id);
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/home`
        }
      });
      
      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signup successful",
          description: "Please check your email to confirm your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
