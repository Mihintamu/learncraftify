
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface SystemSettings {
  siteName: string;
  contactEmail: string;
  maxUploadSize: string;
  notificationsEnabled: boolean;
  maintenanceMode: boolean;
  welcomeMessage: string;
}

interface SystemPreferencesSectionProps {
  systemSettings: SystemSettings;
  onSystemSettingsChange: (settings: SystemSettings) => void;
}

const SystemPreferencesSection = ({ 
  systemSettings,
  onSystemSettingsChange
}: SystemPreferencesSectionProps) => {
  const { toast } = useToast();
  const [isConfiguringSettings, setIsConfiguringSettings] = useState(false);
  const [editedSettings, setEditedSettings] = useState<SystemSettings>({...systemSettings});

  const handleConfigureSettings = () => {
    setEditedSettings({...systemSettings});
    setIsConfiguringSettings(true);
  };
  
  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setEditedSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const saveSystemSettings = () => {
    // Validate settings
    if (!editedSettings.siteName || !editedSettings.contactEmail) {
      toast({
        title: "Error",
        description: "Site name and contact email are required",
        variant: "destructive",
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedSettings.contactEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    // Number validation
    if (isNaN(parseInt(editedSettings.maxUploadSize)) || parseInt(editedSettings.maxUploadSize) <= 0) {
      toast({
        title: "Error",
        description: "Max upload size must be a positive number",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate saving to server
    setTimeout(() => {
      onSystemSettingsChange({...editedSettings});
      setIsConfiguringSettings(false);
      
      // In a real app, this would be saved to a database
      localStorage.setItem('systemSettings', JSON.stringify(editedSettings));
      
      toast({
        title: "Settings Updated",
        description: "System settings have been saved successfully",
      });
    }, 1000);
  };
  
  const cancelSettingsChanges = () => {
    setEditedSettings({...systemSettings});
    setIsConfiguringSettings(false);
  };

  return (
    <div>
      <h3 className="font-medium mb-4">System Preferences</h3>
      
      {isConfiguringSettings ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Site Name</label>
            <Input
              value={editedSettings.siteName}
              onChange={(e) => handleSettingChange('siteName', e.target.value)}
              placeholder="Site name"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Contact Email</label>
            <Input
              type="email"
              value={editedSettings.contactEmail}
              onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
              placeholder="admin@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Max Upload Size (MB)</label>
            <Input
              type="number"
              value={editedSettings.maxUploadSize}
              onChange={(e) => handleSettingChange('maxUploadSize', e.target.value)}
              placeholder="10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="notificationsEnabled"
              checked={editedSettings.notificationsEnabled}
              onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="notificationsEnabled" className="text-sm text-gray-600">
              Enable Email Notifications
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={editedSettings.maintenanceMode}
              onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
              className="rounded"
            />
            <label htmlFor="maintenanceMode" className="text-sm text-gray-600">
              Maintenance Mode
            </label>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Welcome Message</label>
            <Textarea
              value={editedSettings.welcomeMessage}
              onChange={(e) => handleSettingChange('welcomeMessage', e.target.value)}
              placeholder="Welcome message for users"
              rows={4}
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={saveSystemSettings}>Save Settings</Button>
            <Button variant="outline" onClick={cancelSettingsChanges}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded p-3">
              <span className="text-sm text-gray-500">Site Name</span>
              <p>{systemSettings.siteName}</p>
            </div>
            
            <div className="border rounded p-3">
              <span className="text-sm text-gray-500">Contact Email</span>
              <p>{systemSettings.contactEmail}</p>
            </div>
            
            <div className="border rounded p-3">
              <span className="text-sm text-gray-500">Max Upload Size</span>
              <p>{systemSettings.maxUploadSize} MB</p>
            </div>
            
            <div className="border rounded p-3">
              <span className="text-sm text-gray-500">Notifications</span>
              <p>{systemSettings.notificationsEnabled ? 'Enabled' : 'Disabled'}</p>
            </div>
            
            <div className="border rounded p-3">
              <span className="text-sm text-gray-500">Maintenance Mode</span>
              <p>{systemSettings.maintenanceMode ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
          
          <div className="border rounded p-3">
            <span className="text-sm text-gray-500">Welcome Message</span>
            <p className="whitespace-pre-wrap">{systemSettings.welcomeMessage}</p>
          </div>
          
          <Button variant="outline" onClick={handleConfigureSettings}>
            Configure Settings
          </Button>
        </div>
      )}
    </div>
  );
};

export default SystemPreferencesSection;
