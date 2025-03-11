
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Bookmark, Book, Clock } from 'lucide-react';

interface UserStat {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface UserStatsProps {
  isLoading: boolean;
  statsData?: {
    generated_docs?: number;
    saved_docs?: number;
    subjects_count?: number;
    usage_time_hours?: number;
  };
}

const UserStats = ({ isLoading, statsData }: UserStatsProps) => {
  const stats: UserStat[] = [
    { 
      label: 'Generated Documents', 
      value: statsData?.generated_docs?.toString() || '0', 
      icon: <FileText className="h-5 w-5 text-purple-500" /> 
    },
    { 
      label: 'Saved Documents', 
      value: statsData?.saved_docs?.toString() || '0', 
      icon: <Bookmark className="h-5 w-5 text-purple-500" /> 
    },
    { 
      label: 'Subjects', 
      value: statsData?.subjects_count?.toString() || '0', 
      icon: <Book className="h-5 w-5 text-purple-500" /> 
    },
    { 
      label: 'Usage Time', 
      value: `${statsData?.usage_time_hours || '0'}h`, 
      icon: <Clock className="h-5 w-5 text-purple-500" /> 
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array(4).fill(0).map((_, index) => (
          <Card key={index} className="hover-lift">
            <CardContent className="p-6">
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover-lift">
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-purple-100 mr-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserStats;
