
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, History, Settings } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSettingsClick: () => void;
}

const MobileNav = ({ activeTab, setActiveTab, onSettingsClick }: MobileNavProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 md:hidden bg-white border-t border-gray-200">
      <div className="flex justify-around">
        <Button 
          variant={activeTab === 'subjects' ? 'default' : 'ghost'} 
          className="flex-1 flex-col py-3 h-auto rounded-none" 
          onClick={() => setActiveTab('subjects')}
        >
          <BookOpen className="h-5 w-5 mb-1" />
          <span className="text-xs">Subjects</span>
        </Button>
        <Button 
          variant={activeTab === 'request' ? 'default' : 'ghost'} 
          className="flex-1 flex-col py-3 h-auto rounded-none" 
          onClick={() => setActiveTab('request')}
        >
          <FileText className="h-5 w-5 mb-1" />
          <span className="text-xs">Request</span>
        </Button>
        <Button 
          variant={activeTab === 'history' ? 'default' : 'ghost'} 
          className="flex-1 flex-col py-3 h-auto rounded-none" 
          onClick={() => setActiveTab('history')}
        >
          <History className="h-5 w-5 mb-1" />
          <span className="text-xs">History</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex-1 flex-col py-3 h-auto rounded-none" 
          onClick={onSettingsClick}
        >
          <Settings className="h-5 w-5 mb-1" />
          <span className="text-xs">Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileNav;
