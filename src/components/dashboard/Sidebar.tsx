
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, History, Settings, LogOut, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onSettingsClick: () => void;
  onSavedClick: () => void;
}

const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  onLogout, 
  onSettingsClick, 
  onSavedClick 
}: SidebarProps) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center gap-2 text-xl font-semibold px-2 py-4">
        <span className="bg-purple-500 text-white p-1 rounded">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            <rect x="9" y="9" width="6" height="6"></rect>
            <line x1="9" y1="1" x2="9" y2="4"></line>
            <line x1="15" y1="1" x2="15" y2="4"></line>
            <line x1="9" y1="20" x2="9" y2="23"></line>
            <line x1="15" y1="20" x2="15" y2="23"></line>
            <line x1="20" y1="9" x2="23" y2="9"></line>
            <line x1="20" y1="14" x2="23" y2="14"></line>
            <line x1="1" y1="9" x2="4" y2="9"></line>
            <line x1="1" y1="14" x2="4" y2="14"></line>
          </svg>
        </span>
        <span>SenpAI</span>
      </div>
      
      <nav className="mt-8 flex flex-col gap-2 flex-1">
        <Button 
          variant={activeTab === 'subjects' ? 'default' : 'ghost'} 
          className="justify-start gap-3" 
          onClick={() => setActiveTab('subjects')}
        >
          <BookOpen className="h-5 w-5" />
          Subjects
        </Button>
        <Button 
          variant={activeTab === 'request' ? 'default' : 'ghost'} 
          className="justify-start gap-3" 
          onClick={() => setActiveTab('request')}
        >
          <FileText className="h-5 w-5" />
          Request Content
        </Button>
        <Button 
          variant={activeTab === 'history' ? 'default' : 'ghost'} 
          className="justify-start gap-3" 
          onClick={() => setActiveTab('history')}
        >
          <History className="h-5 w-5" />
          History
        </Button>
        <Button 
          variant="ghost" 
          className="justify-start gap-3" 
          onClick={onSavedClick}
        >
          <Bookmark className="h-5 w-5" />
          Saved
        </Button>
        <Button 
          variant="ghost" 
          className="justify-start gap-3" 
          onClick={onSettingsClick}
        >
          <Settings className="h-5 w-5" />
          Settings
        </Button>
      </nav>
      
      <Button 
        variant="outline" 
        className="mt-auto justify-start gap-3" 
        onClick={onLogout}
      >
        <LogOut className="h-5 w-5" />
        Logout
      </Button>
    </aside>
  );
};

export default Sidebar;
