
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface PreferencesSectionProps {
  isLoading: boolean;
  theme: string;
  language: string;
  onSettingChange: (key: 'theme' | 'language', value: string) => void;
}

const PreferencesSection = ({ 
  isLoading, 
  theme, 
  language, 
  onSettingChange 
}: PreferencesSectionProps) => {
  return (
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
                value={theme} 
                onValueChange={(value) => onSettingChange('theme', value)}
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
                value={language} 
                onValueChange={(value) => onSettingChange('language', value)}
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
  );
};

export default PreferencesSection;
