
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AccessCodeSection from './settings/AccessCodeSection';
import SystemPreferencesSection from './settings/SystemPreferencesSection';

interface SystemSettings {
  siteName: string;
  contactEmail: string;
  maxUploadSize: string;
  notificationsEnabled: boolean;
  maintenanceMode: boolean;
  welcomeMessage: string;
}

const SettingsTab = () => {
  // Settings state
  const [currentAccessCode, setCurrentAccessCode] = useState('ADMIN@123*');
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'Learn Connect',
    contactEmail: 'admin@learnconnect.com',
    maxUploadSize: '10',
    notificationsEnabled: true,
    maintenanceMode: false,
    welcomeMessage: 'Welcome to Learn Connect! Find the best resources for your studies.',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AccessCodeSection 
          currentAccessCode={currentAccessCode}
          onAccessCodeChange={setCurrentAccessCode}
        />
        
        <SystemPreferencesSection 
          systemSettings={systemSettings}
          onSystemSettingsChange={setSystemSettings}
        />
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
