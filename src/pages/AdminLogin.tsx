
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [accessCode, setAccessCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessCode) {
      toast({
        title: "Error",
        description: "Please enter the admin access code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if the access code is correct
      if (accessCode === 'ADMIN@123*') {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        toast({
          title: "Success",
          description: "Admin access granted",
        });
        
        // Navigate to admin dashboard (to be created)
        navigate('/dashboard');
      } else {
        throw new Error('Invalid access code');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid admin access code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-900 to-purple-900">
      <Link to="/" className="flex items-center gap-2 text-xl font-semibold mb-8 text-white">
        <span className="bg-purple-500 text-white p-1 rounded">LC</span>
        <span>LearnCraftify</span>
      </Link>
      
      <Card className="w-full max-w-md animate-fade-up">
        <CardHeader className="space-y-1">
          <div className="mx-auto bg-purple-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Admin Access</CardTitle>
          <CardDescription className="text-center">
            Enter your administrator access code to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="accessCode" className="text-sm font-medium">
                Access Code
              </label>
              <Input
                id="accessCode"
                type="password"
                placeholder="Enter admin access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Access Admin Dashboard'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-gray-600 w-full">
            Return to{' '}
            <Link to="/" className="font-medium text-purple-600 hover:text-purple-700">
              Main Site
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
