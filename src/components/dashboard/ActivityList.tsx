
import { Card, CardContent } from '@/components/ui/card';
import { FileText, BookOpen, ChevronRight } from 'lucide-react';

export interface ActivityItem {
  id: number;
  title: string;
  subject: string;
  date: string;
  type: 'assignment' | 'notes';
}

interface ActivityListProps {
  activities: ActivityItem[];
  onActivityClick: (activity: ActivityItem) => void;
}

const ActivityList = ({ activities, onActivityClick }: ActivityListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
      
      {activities.map((item) => (
        <Card 
          key={item.id} 
          className="hover-lift cursor-pointer"
          onClick={() => onActivityClick(item)}
        >
          <CardContent className="p-4 flex items-center">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600 mr-4">
              {item.type === 'assignment' ? (
                <FileText className="h-5 w-5" />
              ) : (
                <BookOpen className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">
                {item.subject} • {item.date}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ActivityList;
