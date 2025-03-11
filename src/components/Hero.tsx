
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/register');
  };
  
  const handleSignIn = () => {
    navigate('/login');
  };
  
  return (
    <section className="relative px-4 pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white -z-10" />
      
      {/* Animated shapes */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-50 animate-pulse-subtle -z-10" />
      <div className="absolute bottom-10 left-10 w-56 h-56 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse-subtle -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 mb-6 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
            AI-Powered Writing Assistant
          </div>
          
          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 animate-fade-up text-balance">
            Craft Perfect Assignments<br className="hidden md:inline" /> with 
            <span className="text-purple-600"> AI Precision</span>
          </h1>
          
          {/* Subtitle */}
          <p className="max-w-2xl text-lg md:text-xl text-gray-600 mb-8 animate-fade-up [animation-delay:200ms] text-balance">
            Generate study materials and assignments that perfectly align with your requirements. 
            Powered by AI and designed for college students.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-md animate-fade-up [animation-delay:400ms]">
            <Button 
              size="lg" 
              className="w-full sm:w-auto rounded-full" 
              onClick={handleGetStarted}
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto rounded-full" 
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          </div>
          
          {/* Preview image */}
          <div className="w-full max-w-4xl mx-auto relative animate-fade-up [animation-delay:600ms]">
            <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-br from-purple-50 via-white to-purple-100 w-full h-full flex items-center justify-center">
                <div className="glass-card w-full max-w-lg mx-auto p-6 rounded-lg border border-purple-200/50 shadow-lg backdrop-blur-md bg-white/70 relative">
                  {/* Decorative elements */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-400 rounded-full animate-pulse-subtle"></div>
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-purple-400 rounded-full animate-pulse-subtle [animation-delay:400ms]"></div>
                  <div className="absolute top-1/2 -right-2 w-3 h-3 bg-purple-300 rounded-full animate-pulse-subtle [animation-delay:600ms]"></div>
                  <div className="absolute top-1/2 -left-2 w-3 h-3 bg-purple-300 rounded-full animate-pulse-subtle [animation-delay:200ms]"></div>
                  
                  {/* Card header with gradient */}
                  <div className="h-8 w-24 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mb-4 flex items-center justify-center">
                    <span className="text-xs text-white font-medium">AI Essay</span>
                  </div>
                  
                  {/* Content lines with different widths and subtle animation */}
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-purple-100 rounded animate-pulse-subtle [animation-delay:100ms]"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-purple-100 rounded animate-pulse-subtle [animation-delay:300ms]" style={{width: '95%'}}></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-purple-100 rounded animate-pulse-subtle [animation-delay:500ms]" style={{width: '85%'}}></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-purple-100 rounded animate-pulse-subtle [animation-delay:700ms]" style={{width: '90%'}}></div>
                  </div>
                  
                  {/* Interactive button with hover effect */}
                  <div className="mt-5 flex justify-end">
                    <div className="h-8 w-24 bg-purple-500 hover:bg-purple-600 transition-colors duration-300 rounded-lg flex items-center justify-center cursor-pointer shadow-md">
                      <span className="text-xs text-white font-medium">Generate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements for visual appeal */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-purple-100 rounded-lg shadow-sm rotate-12"></div>
            <div className="absolute -bottom-8 right-20 w-16 h-16 bg-purple-200 rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
