
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const isAdminAuthenticated = localStorage.getItem('adminAuthenticated');
      console.log('Admin auth check:', isAdminAuthenticated);
      
      if (isAdminAuthenticated !== 'true') {
        navigate('/admin');
        toast({
          title: "Authentication required",
          description: "Please login to access the admin panel",
          variant: "destructive",
        });
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel",
    });
    navigate('/admin');
  };

  return { handleLogout };
};
