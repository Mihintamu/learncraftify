
import { useState } from 'react';
import { PencilLine } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileData {
  username: string;
  full_name: string;
  avatar_url: string;
}

interface ProfileSectionProps {
  isLoading: boolean;
  profile: ProfileData;
  onProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileSection = ({ isLoading, profile, onProfileChange }: ProfileSectionProps) => {
  return (
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
                  onChange={onProfileChange}
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
                  onChange={onProfileChange}
                  className="pl-8"
                />
                <PencilLine className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
