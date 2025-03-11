import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const subjects = [
  {
    id: 1,
    title: 'Mathematics',
    description: 'Calculus, Algebra, Statistics, and more',
    icon: 'BarChart',
    href: '#'
  },
  {
    id: 2,
    title: 'Computer Science',
    description: 'Programming, Algorithms, Data Structures',
    icon: 'Book',
    href: '#'
  },
  {
    id: 3,
    title: 'Physics',
    description: 'Mechanics, Thermodynamics, Electromagnetism',
    icon: 'BookOpen',
    href: '#'
  },
  {
    id: 4,
    title: 'Literature',
    description: 'Essays, Analysis, Research Papers',
    icon: 'FileText',
    href: '#'
  }
];

const recentActivityData = [
  {
    id: 1,
    title: 'Physics Assignment',
    subject: 'Physics',
    date: '2 hours ago',
    type: 'assignment' as const
  },
  {
    id: 2,
    title: 'Calculus Notes',
    subject: 'Mathematics',
    date: 'Yesterday',
    type: 'notes' as const
  },
  {
    id: 3,
    title: 'Data Structures Review',
    subject: 'Computer Science',
    date: '3 days ago',
    type: 'notes' as const
  }
];

export const useDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('subjects');
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please log in to access the dashboard');
        navigate('/login');
        return;
      }
      
      fetchUserData(session.user.id);
    };
    
    checkAuth();
  }, [navigate]);
  
  const fetchUserData = async (userId) => {
    try {
      setIsLoading(true);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (statsError) throw statsError;
      
      setUserProfile(profileData);
      setUserStats(statsData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Successfully logged out');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to log out');
    }
  };
  
  const handleSettingsClick = () => {
    navigate('/settings');
  };
  
  const handleSavedClick = () => {
    toast.info('Saved materials will be available in the next update');
  };
  
  const handleActivityClick = (activity) => {
    toast.info(`Opening ${activity.title}`);
  };

  return {
    activeTab,
    setActiveTab,
    userProfile,
    userStats,
    isLoading,
    subjects,
    recentActivityData,
    handleLogout,
    handleSettingsClick,
    handleSavedClick,
    handleActivityClick
  };
};
