
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const SettingsTab = () => {
  const { toast } = useToast();
  
  // Settings state
  const [isChangingAccessCode, setIsChangingAccessCode] = useState(false);
  const [isConfiguringSettings, setIsConfiguringSettings] = useState(false);
  const [currentAccessCode, setCurrentAccessCode] = useState('ADMIN@123*');
  const [newAccessCode, setNewAccessCode] = useState('');
  const [confirmAccessCode, setConfirmAccessCode] = useState('');
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'Learn Connect',
    contactEmail: 'admin@learnconnect.com',
    maxUploadSize: '10',
    notificationsEnabled: true,
    maintenanceMode: false,
    welcomeMessage: 'Welcome to Learn Connect! Find the best resources for your studies.',
  });
  const [editedSettings, setEditedSettings] = useState({...systemSettings});

  // Settings functions
  const handleChangeAccessCode = () => {
    setIsChangingAccessCode(true);
  };
  
  const submitAccessCodeChange = () => {
    // Validate inputs
    if (!newAccessCode || !confirmAccessCode) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (newAccessCode !== confirmAccessCode) {
      toast({
        title: "Error",
        description: "New access codes do not match",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate processing delay
    setTimeout(() => {
      setCurrentAccessCode(newAccessCode);
      setNewAccessCode('');
      setConfirmAccessCode('');
      setIsChangingAccessCode(false);
      
      // Update in localStorage for persistence (in a real app, this would be server-side)
      localStorage.setItem('adminAccessCode', newAccessCode);
      
      toast({
        title: "Access Code Updated",
        description: "Admin access code has been changed successfully",
      });
    }, 1000);
  };
  
  const cancelAccessCodeChange = () => {
    setNewAccessCode('');
    setConfirmAccessCode('');
    setIsChangingAccessCode(false);
  };
  
  const handleConfigureSettings = () => {
    setEditedSettings({...systemSettings});
    setIsConfiguringSettings(true);
  };
  
  const handleSettingChange = (key: string, value: any) => {
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
      setSystemSettings({...editedSettings});
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
    <Card>
      <CardHeader>
        <CardTitle>Admin Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-b pb-6">
          <h3 className="font-medium mb-4">Admin Access</h3>
          
          {isChangingAccessCode ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600">New Access Code</label>
                <Input
                  type="password"
                  value={newAccessCode}
                  onChange={(e) => setNewAccessCode(e.target.value)}
                  placeholder="Enter new access code"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Confirm Access Code</label>
                <Input
                  type="password"
                  value={confirmAccessCode}
                  onChange={(e) => setConfirmAccessCode(e.target.value)}
                  placeholder="Confirm new access code"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={submitAccessCodeChange}>Save Changes</Button>
                <Button variant="outline" onClick={cancelAccessCodeChange}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Button onClick={handleChangeAccessCode}>
              Change Access Code
            </Button>
          )}
        </div>
        
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
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
