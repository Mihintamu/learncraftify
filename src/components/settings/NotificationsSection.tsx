
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';

interface NotificationPreferences {
  email: boolean;
  push: boolean;
}

interface UserSettings {
  notification_preferences: NotificationPreferences;
  weekly_summary: boolean;
  study_reminders: boolean;
}

interface NotificationsSectionProps {
  isLoading: boolean;
  settings: UserSettings;
  onNotificationChange: (key: keyof NotificationPreferences, value: boolean) => void;
  onSettingChange: (key: 'weekly_summary' | 'study_reminders', value: boolean) => void;
}

const NotificationsSection = ({ 
  isLoading, 
  settings, 
  onNotificationChange, 
  onSettingChange 
}: NotificationsSectionProps) => {
  return (
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
                onCheckedChange={(checked) => onNotificationChange('email', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-gray-500">Receive push notifications on your device</p>
              </div>
              <Switch 
                checked={settings.notification_preferences.push} 
                onCheckedChange={(checked) => onNotificationChange('push', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium">Weekly Summary</h3>
                <p className="text-sm text-gray-500">Receive a weekly summary of your study progress</p>
              </div>
              <Switch 
                checked={settings.weekly_summary} 
                onCheckedChange={(checked) => onSettingChange('weekly_summary', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium">Study Reminders</h3>
                <p className="text-sm text-gray-500">Get reminders for study sessions</p>
              </div>
              <Switch 
                checked={settings.study_reminders} 
                onCheckedChange={(checked) => onSettingChange('study_reminders', checked)}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsSection;
