
import { useState } from 'react';

interface SystemSettings {
  siteName: string;
  contactEmail: string;
  maxUploadSize: string;
  notificationsEnabled: boolean;
  maintenanceMode: boolean;
  welcomeMessage: string;
}

export const useAdminSettings = () => {
  const [currentAccessCode, setCurrentAccessCode] = useState('ADMIN@123*');
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'Learn Connect',
    contactEmail: 'admin@learnconnect.com',
    maxUploadSize: '10',
    notificationsEnabled: true,
    maintenanceMode: false,
    welcomeMessage: 'Welcome to Learn Connect! Find the best resources for your studies.',
  });

  return {
    currentAccessCode,
    setCurrentAccessCode,
    systemSettings,
    setSystemSettings
  };
};
