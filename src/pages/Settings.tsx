
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, ChevronLeft, Save, Bell, Monitor, Globe, Clock, PencilLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Json } from '@/integrations/supabase/types';

interface NotificationPreferences {
  email: boolean;
  push: boolean;
}

interface UserSettings {
  notification_preferences: NotificationPreferences;
  theme: string;
  language: string;
  weekly_summary: boolean;
  study_reminders: boolean;
}

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState({
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-4"
              onClick={() => navigate('/dashboard')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="bg-purple-500 text-white p-1 rounded">
                <Cpu className="h-5 w-5" />
              </span>
              <span className="text-xl font-semibold">SenpAI</span>
            </div>
          </div>
          <Button 
            onClick={saveSettings} 
            disabled={isSaving || isLoading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </header>
      
      <main className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Manage your personal information and profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoading ? (
                    <>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                          <Input
                            id="username"
                            name="username"
                            value={profile.username}
                            onChange={handleProfileChange}
                            className="pl-8"
                          />
                          <PencilLine className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <div className="relative">
                          <Input
                            id="full_name"
                            name="full_name"
                            value={profile.full_name}
                            onChange={handleProfileChange}
                            className="pl-8"
                          />
                          <PencilLine className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Customize how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoading ? (
                    Array(3).fill(0).map((_, index) => (
                      <div key={index} className="flex items-center justify-between py-3">
                        <div>
                          <Skeleton className="h-5 w-40 mb-1" />
                          <Skeleton className="h-4 w-60" />
                        </div>
                        <Skeleton className="h-6 w-12" />
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center justify-between py-3 border-b">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive email updates about your account</p>
                        </div>
                        <Switch 
                          checked={settings.notification_preferences.email} 
                          onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-b">
                        <div>
                          <h3 className="font-medium">Push Notifications</h3>
                          <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                        </div>
                        <Switch 
                          checked={settings.notification_preferences.push} 
                          onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <h3 className="font-medium">Weekly Summary</h3>
                          <p className="text-sm text-gray-500">Receive a weekly summary of your study progress</p>
                        </div>
                        <Switch 
                          checked={settings.weekly_summary} 
                          onCheckedChange={(checked) => handleSettingChange('weekly_summary', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <h3 className="font-medium">Study Reminders</h3>
                          <p className="text-sm text-gray-500">Get reminders for study sessions</p>
                        </div>
                        <Switch 
                          checked={settings.study_reminders} 
                          onCheckedChange={(checked) => handleSettingChange('study_reminders', checked)}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Application Preferences</CardTitle>
                  <CardDescription>
                    Customize your app experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoading ? (
                    Array(2).fill(0).map((_, index) => (
                      <div key={index} className="space-y-2 mb-6">
                        <Skeleton className="h-5 w-20 mb-1" />
                        <Skeleton className="h-4 w-60 mb-3" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-medium">Theme</h3>
                          <p className="text-sm text-gray-500">Choose your preferred theme</p>
                        </div>
                        <RadioGroup 
                          value={settings.theme} 
                          onValueChange={(value) => handleSettingChange('theme', value)}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="light" id="theme-light" />
                            <Label htmlFor="theme-light">Light</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dark" id="theme-dark" />
                            <Label htmlFor="theme-dark">Dark</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="system" id="theme-system" />
                            <Label htmlFor="theme-system">System</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-sm font-medium">Language</h3>
                          <p className="text-sm text-gray-500">Select your preferred language</p>
                        </div>
                        <Select 
                          value={settings.language} 
                          onValueChange={(value) => handleSettingChange('language', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
