
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface FormData {
  email: string;
  password: string;
  username?: string;
  phone?: string;
}

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    username: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (isRegistering && !formData.username) {
      toast.error("Username is required for registration");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        // Handle registration
        console.log('Attempting registration with:', { 
          email: formData.email,
          username: formData.username,
          phone: formData.phone 
        });
        
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
              phone: formData.phone || '',
              full_name: formData.username, // Setting full_name to username initially
            }
          }
        });

        if (error) {
          console.error('Registration error:', error);
          toast.error(error.message || 'Failed to register');
          return;
        }

        if (data.user) {
          console.log('Registration successful:', data.user);
          
          if (data.user.identities && data.user.identities.length === 0) {
            toast.error('This email is already registered. Please login instead.');
            setIsRegistering(false);
            return;
          }
          
          toast.success('Registration successful! Please check your email to confirm your account.');
          setIsRegistering(false);
        }
      } else {
        // Handle login
        console.log('Attempting login with:', { email: formData.email });
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          console.error('Login error:', error);
          if (error.message.includes('Email not confirmed')) {
            toast.error('Please check your email to confirm your account');
          } else if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password. If you\'re new, please register first.');
          } else {
            toast.error(error.message || 'Failed to login');
          }
          return;
        }

        if (data.user) {
          console.log('Login successful:', data.user);
          toast.success('Successfully logged in');
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          disabled={isLoading}
          required
        />
      </div>
      
      {isRegistering && (
        <>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone (optional)
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1234567890"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
              disabled={isLoading}
            />
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Link
            to="#"
            className="text-sm font-medium text-purple-600 hover:text-purple-700"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            autoComplete={isRegistering ? "new-password" : "current-password"}
            disabled={isLoading}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isRegistering ? 'Creating account...' : 'Signing in...'}
          </>
        ) : (
          isRegistering ? 'Register' : 'Sign in'
        )}
      </Button>
      
      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering 
            ? 'Already have an account? Sign in' 
            : 'Don\'t have an account? Register'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
