
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
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p className="mb-2">
          Having trouble logging in? Try these steps:
        </p>
        <ul className="list-disc text-left inline-block">
          <li>Check your email for verification link if you just registered</li>
          <li>Make sure you're using the correct email and password</li>
          <li>If you're new, use the "Register" option to create an account first</li>
        </ul>
      </div>
    </div>
  );
};

export default Login;
