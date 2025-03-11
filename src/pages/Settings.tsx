
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserSettings } from '@/hooks/useUserSettings';
import SettingsHeader from '@/components/settings/SettingsHeader';
import ProfileSection from '@/components/settings/ProfileSection';
import NotificationsSection from '@/components/settings/NotificationsSection';
import PreferencesSection from '@/components/settings/PreferencesSection';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  const {
    profile,
    settings,
    isLoading,
    isSaving,
    handleProfileChange,
    handleNotificationChange,
    handleSettingChange,
    saveSettings
  } = useUserSettings();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <SettingsHeader 
        isSaving={isSaving} 
        isLoading={isLoading} 
        onSave={saveSettings} 
      />
      
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
              <ProfileSection
                isLoading={isLoading}
                profile={profile}
                onProfileChange={handleProfileChange}
              />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationsSection
                isLoading={isLoading}
                settings={settings}
                onNotificationChange={handleNotificationChange}
                onSettingChange={handleSettingChange}
              />
            </TabsContent>
            
            <TabsContent value="preferences">
              <PreferencesSection
                isLoading={isLoading}
                theme={settings.theme}
                language={settings.language}
                onSettingChange={handleSettingChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
