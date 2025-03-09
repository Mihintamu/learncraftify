
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Users, Book, FileText, Settings, LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('subjects');

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel",
    });
    navigate('/admin');
  };

  const handleAddContent = () => {
    toast({
      title: "Coming Soon",
      description: "Content upload functionality will be available soon",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200">
        <div className="flex items-center gap-2 px-6 py-4 border-b">
          <span className="bg-purple-500 text-white p-1 rounded">LC</span>
          <span className="font-semibold">Admin Panel</span>
        </div>
        
        <nav className="flex flex-col p-4 space-y-1 flex-1">
          <Button variant="ghost" className="justify-start" onClick={() => setActiveTab('subjects')}>
            <Book className="mr-2 h-4 w-4" />
            Subjects
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActiveTab('content')}>
            <FileText className="mr-2 h-4 w-4" />
            Content
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActiveTab('users')}>
            <Users className="mr-2 h-4 w-4" />
            Users
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActiveTab('settings')}>
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
          <Button variant="ghost" className="flex flex-col items-center py-3 px-0 h-auto rounded-none" onClick={() => setActiveTab('subjects')}>
            <Book className="h-5 w-5" />
            <span className="text-xs mt-1">Subjects</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-3 px-0 h-auto rounded-none" onClick={() => setActiveTab('content')}>
            <FileText className="h-5 w-5" />
            <span className="text-xs mt-1">Content</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-3 px-0 h-auto rounded-none" onClick={() => setActiveTab('users')}>
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Users</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center py-3 px-0 h-auto rounded-none" onClick={() => setActiveTab('settings')}>
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        {/* Content area */}
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
            
            <TabsContent value="subjects" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Manage Subjects</h2>
                <Button>
                  <Book className="mr-2 h-4 w-4" />
                  Add Subject
                </Button>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                {["Mathematics", "Computer Science", "Engineering", "Physics", "Chemistry", "Biology"].map((subject) => (
                  <Card key={subject}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{subject}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="destructive">Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Manage Content</h2>
                <Button onClick={handleAddContent}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Content
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Content Repository</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    No content has been uploaded yet. Click "Upload Content" to add study materials.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Manage Users</h2>
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Export Users
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    User management functionality will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Admin Access</h3>
                    <Button>Change Access Code</Button>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">System Preferences</h3>
                    <Button variant="outline">Configure Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
