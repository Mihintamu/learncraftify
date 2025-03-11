
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubjectsTab from './SubjectsTab';
import ContentTab from './ContentTab';
import UsersTab from './UsersTab';
import SettingsTab from './SettingsTab';

interface AdminContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminContent = ({ activeTab, setActiveTab }: AdminContentProps) => {
  return (
    <main className="flex-1 p-6 pb-20 md:pb-6 overflow-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-6">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="subjects">
          <SubjectsTab />
        </TabsContent>
        
        <TabsContent value="content">
          <ContentTab />
        </TabsContent>
        
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default AdminContent;
