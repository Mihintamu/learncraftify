
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SocialLoginProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const SocialLogin = ({ isLoading, setIsLoading }: SocialLoginProps) => {
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        title: "Error",
        description: error.message || "Could not sign in with Google",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Apple login error:', error);
      toast({
        title: "Error",
        description: error.message || "Could not sign in with Apple",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full">
        <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
          Google
        </Button>
        <Button variant="outline" className="w-full" onClick={handleAppleLogin} disabled={isLoading}>
          Apple
        </Button>
      </div>
    </>
  );
};

export default SocialLogin;
