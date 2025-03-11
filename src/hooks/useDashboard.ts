
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types for our data
interface Subject {
  id: string;
  name: string;
  description?: string;
  icon: string;
  href: string;
}

interface ActivityItem {
  id: number;
  title: string;
  subject: string;
  date: string;
  type: 'assignment' | 'notes';
}

export const useDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('subjects');
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [recentActivityData, setRecentActivityData] = useState<ActivityItem[]>([]);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please log in to access the dashboard');
        navigate('/login');
        return;
      }
      
      fetchUserData(session.user.id);
      fetchSubjects();
      fetchRecentActivity();
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

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      
      // Map the subjects data to include icons and descriptions
      const subjectIcons = {
        'Mathematics': 'BarChart',
        'Computer Science': 'Book',
        'Physics': 'BookOpen',
        'Literature': 'FileText',
        'Financial Accounting': 'Calculator',
        'Engineering': 'Tool',
        'Biology': 'Leaf',
        'Chemistry': 'Flask',
        'Economics': 'TrendingUp',
        'History': 'Clock'
      };

      const subjectDescriptions = {
        'Mathematics': 'Calculus, Algebra, Statistics, and more',
        'Computer Science': 'Programming, Algorithms, Data Structures',
        'Physics': 'Mechanics, Thermodynamics, Electromagnetism',
        'Literature': 'Essays, Analysis, Research Papers',
        'Financial Accounting': 'Financial statements, Auditing, Taxation',
        'Engineering': 'Mechanical, Electrical, Civil engineering topics',
        'Biology': 'Anatomy, Genetics, Ecology, and more',
        'Chemistry': 'Organic, Inorganic, Physical chemistry',
        'Economics': 'Microeconomics, Macroeconomics, Finance',
        'History': 'Ancient, Modern, World history'
      };
      
      const mappedSubjects = data?.map(subject => ({
        id: subject.id,
        title: subject.name,
        description: subjectDescriptions[subject.name] || `Study materials for ${subject.name}`,
        icon: subjectIcons[subject.name] || 'BookOpen',
        href: `#${subject.name.toLowerCase().replace(/\s+/g, '-')}`
      })) || [];
      
      setSubjects(mappedSubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to load subjects');
      // Fallback to empty array if there's an error
      setSubjects([]);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // In a real implementation, you would fetch actual activity data
      // For now, we'll use placeholder data since we don't have an activity table yet
      const activityData = [
        {
          id: 1,
          title: 'Recent Content Request',
          subject: 'General',
          date: new Date().toLocaleDateString(),
          type: 'notes' as const
        }
      ];
      
      setRecentActivityData(activityData);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setRecentActivityData([]);
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
