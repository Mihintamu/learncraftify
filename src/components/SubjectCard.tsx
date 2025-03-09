
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SubjectCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  className?: string;
}

const SubjectCard = ({ title, description, icon, href, className }: SubjectCardProps) => {
  return (
    <Link to={href}>
      <Card 
        className={cn(
          "overflow-hidden hover-lift cursor-pointer group h-full", 
          className
        )}
      >
        <CardContent className="p-6">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-purple-100 text-purple-600 mb-4 transition-colors group-hover:bg-purple-600 group-hover:text-white">
            {icon}
          </div>
          <h3 className="text-lg font-semibold mb-2 transition-colors group-hover:text-purple-600">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SubjectCard;
