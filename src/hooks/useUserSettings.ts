
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Json } from '@/integrations/supabase/types';

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
}

export interface UserSettings {
  notification_preferences: NotificationPreferences;
  theme: string;
  language: string;
  weekly_summary: boolean;
  study_reminders: boolean;
}

export interface ProfileData {
  username: string;
  full_name: string;
  avatar_url: string;
}

export const useUserSettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState<ProfileData>({
    username: '',
    full_name: '',
    avatar_url: ''
  });
  
  const [settings, setSettings] = useState<UserSettings>({
    notification_preferences: {
      email: true,
      push: true
    },
    theme: 'light',
    language: 'en',
    weekly_summary: true,
    study_reminders: true
  });
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please log in to access settings');
        navigate('/login');
        return;
      }
      
      fetchUserData(session.user.id);
    };
    
    checkAuth();
  }, [navigate]);
  
  const fetchUserData = async (userId: string) => {
    try {
      setIsLoading(true);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (settingsError) throw settingsError;
      
      setProfile({
        username: profileData.username || '',
        full_name: profileData.full_name || '',
        avatar_url: profileData.avatar_url || ''
      });
      
      // Safely handle the notification_preferences JSON field from the database
      let notificationPrefs: NotificationPreferences = { email: true, push: true };
      
      if (settingsData.notification_preferences) {
        // Make sure it's an object and not an array
        if (typeof settingsData.notification_preferences === 'object' && 
            !Array.isArray(settingsData.notification_preferences)) {
          
          const prefs = settingsData.notification_preferences as Record<string, unknown>;
          
          // Extract values and convert them to boolean
          notificationPrefs = {
            email: prefs.email !== undefined ? Boolean(prefs.email) : true,
            push: prefs.push !== undefined ? Boolean(prefs.push) : true
          };
        }
      }
      
      setSettings({
        notification_preferences: notificationPrefs,
        theme: settingsData.theme || 'light',
        language: settingsData.language || 'en',
        weekly_summary: settingsData.weekly_summary !== null ? Boolean(settingsData.weekly_summary) : true,
        study_reminders: settingsData.study_reminders !== null ? Boolean(settingsData.study_reminders) : true
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load settings data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (key: keyof NotificationPreferences, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notification_preferences: {
        ...prev.notification_preferences,
        [key]: value
      }
    }));
  };
  
  const handleSettingChange = (key: keyof Omit<UserSettings, 'notification_preferences'>, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const saveSettings = async () => {
    try {
      setIsSaving(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");
      
      const userId = session.user.id;
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (profileError) throw profileError;
      
      // Convert NotificationPreferences to a JSON-compatible format (Record<string, Json>)
      const notificationPreferences = {
        email: settings.notification_preferences.email,
        push: settings.notification_preferences.push
      } as Record<string, boolean>;
      
      const { error: settingsError } = await supabase
        .from('user_settings')
        .update({
          notification_preferences: notificationPreferences,
          theme: settings.theme,
          language: settings.language,
          weekly_summary: settings.weekly_summary,
          study_reminders: settings.study_reminders,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (settingsError) throw settingsError;
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    profile,
    settings,
    isLoading,
    isSaving,
    handleProfileChange,
    handleNotificationChange,
    handleSettingChange,
    saveSettings
  };
};
