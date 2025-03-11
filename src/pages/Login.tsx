
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import SocialLogin from '@/components/auth/SocialLogin';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-purple-50 to-white">
      <Link to="/" className="flex items-center gap-2 text-xl font-semibold mb-8">
        <span className="bg-purple-500 text-white p-1 rounded">
          <Cpu className="h-5 w-5" />
        </span>
        <span>SenpAI</span>
      </Link>
      
      <Card className="w-full max-w-md animate-fade-up">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <SocialLogin isLoading={isLoading} setIsLoading={setIsLoading} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
