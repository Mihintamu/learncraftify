
import { Button } from '@/components/ui/button';
import { Book, FileText, Users, Settings, LogOut, Cpu } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

const Sidebar = ({ activeTab, setActiveTab, handleLogout }: SidebarProps) => {
  return (
    <>
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
        <div className="flex items-center gap-2 px-6 py-4 border-b">
          <span className="bg-purple-500 text-white p-1 rounded">
            <Cpu className="h-5 w-5" />
          </span>
          <span className="font-semibold">Admin Panel</span>
        </div>
        
        <nav className="flex flex-col p-4 space-y-1 flex-1">
          <Button 
            variant={activeTab === "subjects" ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab('subjects')}
          >
            <Book className="mr-2 h-4 w-4" />
            Subjects
          </Button>
          <Button 
            variant={activeTab === "content" ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab('content')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Content
          </Button>
          <Button 
            variant={activeTab === "users" ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab('users')}
          >
            <Users className="mr-2 h-4 w-4" />
            Users
          </Button>
          <Button 
            variant={activeTab === "settings" ? "default" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
        
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="grid grid-cols-4 gap-1">
          <Button 
            variant="ghost" 
            className={`flex flex-col items-center py-3 px-0 h-auto rounded-none ${activeTab === "subjects" ? "bg-gray-100" : ""}`}
            onClick={() => setActiveTab('subjects')}
          >
            <Book className="h-5 w-5" />
            <span className="text-xs mt-1">Subjects</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`flex flex-col items-center py-3 px-0 h-auto rounded-none ${activeTab === "content" ? "bg-gray-100" : ""}`}
            onClick={() => setActiveTab('content')}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs mt-1">Content</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`flex flex-col items-center py-3 px-0 h-auto rounded-none ${activeTab === "users" ? "bg-gray-100" : ""}`}
            onClick={() => setActiveTab('users')}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Users</span>
          </Button>
          <Button 
            variant="ghost" 
            className={`flex flex-col items-center py-3 px-0 h-auto rounded-none ${activeTab === "settings" ? "bg-gray-100" : ""}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
