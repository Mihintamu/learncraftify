
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/register');
  };

  const handleDashboardClick = () => {
    // Check if user is logged in (in a real app, this would check auth state)
    const isLoggedIn = location.pathname === '/dashboard'; // Simplified for demo
    
    if (!isLoggedIn) {
      toast.info('Please log in to access the dashboard');
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-semibold text-foreground"
        >
          <span className="bg-purple-500 text-white p-1 rounded">
            <Cpu className="h-5 w-5" />
          </span>
          <span className="tracking-tight">SenpAI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            to="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <button
            onClick={handleDashboardClick}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Dashboard
          </button>
          <div className="ml-4 flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={handleLoginClick}
            >
              Log in
            </Button>
            <Button 
              size="sm" 
              className="rounded-full" 
              onClick={handleSignupClick}
            >
              Sign up
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-md px-4 py-4 animate-fade-in">
          <nav className="flex flex-col gap-3">
            <Link
              to="/"
              className="py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className="py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <button
              onClick={handleDashboardClick}
              className="py-2 text-sm font-medium text-foreground hover:text-primary transition-colors text-left"
            >
              Dashboard
            </button>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={handleLoginClick}
              >
                Log in
              </Button>
              <Button 
                className="w-full rounded-full" 
                onClick={handleSignupClick}
              >
                Sign up
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
