
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Badge component for the pill at the top
const HeroBadge = () => (
  <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 mb-6 animate-fade-in">
    <span className="flex h-2 w-2 rounded-full bg-purple-500 mr-2"></span>
    AI-Powered Writing Assistant
  </div>
);

// Heading component with main title
const HeroHeading = () => (
  <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6 animate-fade-up text-balance">
    Craft Perfect Assignments<br className="hidden md:inline" /> with 
    <span className="text-purple-600"> AI Precision</span>
  </h1>
);

// Subtitle component
const HeroSubtitle = () => (
  <p className="max-w-2xl text-lg md:text-xl text-gray-600 mb-8 animate-fade-up [animation-delay:200ms] text-balance">
    Generate study materials and assignments that perfectly align with your requirements. 
    Powered by AI and designed for college students.
  </p>
);

// Call-to-Action buttons component
const HeroButtons = ({ onGetStarted, onSignIn }) => (
  <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-md animate-fade-up [animation-delay:400ms]">
    <Button 
      size="lg" 
      className="w-full sm:w-auto rounded-full" 
      onClick={onGetStarted}
    >
      Get Started <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
    <Button 
      variant="outline" 
      size="lg" 
      className="w-full sm:w-auto rounded-full" 
      onClick={onSignIn}
    >
      Sign In
    </Button>
  </div>
);

// Preview component that shows the AI Essay card
const HeroPreview = () => {
  // Decorative element component to reduce repetition
  const DecorativeElement = ({ className, delay = "" }) => (
    <div className={`${className} bg-purple-400 rounded-full animate-pulse-subtle ${delay}`}></div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto relative animate-fade-up [animation-delay:600ms]">
      <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-br from-purple-50 via-white to-purple-100 w-full h-full flex items-center justify-center">
          <div className="glass-card w-full max-w-lg mx-auto p-6 rounded-lg border border-purple-200/50 shadow-lg backdrop-blur-md bg-white/70 relative">
            {/* Decorative elements */}
            <DecorativeElement className="absolute -top-2 -left-2 w-4 h-4" />
            <DecorativeElement className="absolute -bottom-2 -right-2 w-4 h-4" delay="[animation-delay:400ms]" />
            <DecorativeElement className="absolute top-1/2 -right-2 w-3 h-3" delay="[animation-delay:600ms]" />
            <DecorativeElement className="absolute top-1/2 -left-2 w-3 h-3" delay="[animation-delay:200ms]" />
            
            {/* Card header with gradient */}
            <div className="h-8 w-24 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mb-4 flex items-center justify-center">
              <span className="text-xs text-white font-medium">AI Essay</span>
            </div>
            
            {/* Content lines with different widths and subtle animation */}
            <div className="space-y-3">
              {[100, 95, 85, 90].map((width, index) => (
                <div 
                  key={index}
                  className="h-4 bg-gradient-to-r from-gray-200 to-purple-100 rounded animate-pulse-subtle" 
                  style={{
                    width: `${width}%`, 
                    animationDelay: `${index * 200 + 100}ms`
                  }}
                ></div>
              ))}
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
  );
};

// Main Hero component that composes all the subcomponents
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
          <HeroBadge />
          <HeroHeading />
          <HeroSubtitle />
          <HeroButtons 
            onGetStarted={handleGetStarted}
            onSignIn={handleSignIn}
          />
          <HeroPreview />
        </div>
      </div>
    </section>
  );
};

export default Hero;
