
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AccessCodeSection from './settings/AccessCodeSection';
import SystemPreferencesSection from './settings/SystemPreferencesSection';
import { useAdminSettings } from '@/hooks/useAdminSettings';

const SettingsTab = () => {
  const {
    currentAccessCode,
    setCurrentAccessCode,
    systemSettings,
    setSystemSettings
  } = useAdminSettings();

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
