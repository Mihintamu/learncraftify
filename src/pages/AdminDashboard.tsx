import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Users, Book, FileText, Settings, LogOut } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('subjects');
  
  // Subject management state
  const [subjects, setSubjects] = useState([
    "Mathematics", "Computer Science", "Engineering", 
    "Physics", "Chemistry", "Biology"
  ]);
  const [newSubject, setNewSubject] = useState('');
  
  // Content management state
  const [contentFiles, setContentFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  // User management state
  const [userExportLoading, setUserExportLoading] = useState(false);
  
  // Settings state
  const [isChangingAccessCode, setIsChangingAccessCode] = useState(false);
  const [isConfiguringSettings, setIsConfiguringSettings] = useState(false);
  const [currentAccessCode, setCurrentAccessCode] = useState('ADMIN@123*');
  const [newAccessCode, setNewAccessCode] = useState('');
  const [confirmAccessCode, setConfirmAccessCode] = useState('');
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'Learn Connect',
    contactEmail: 'admin@learnconnect.com',
    maxUploadSize: '10',
    notificationsEnabled: true,
    maintenanceMode: false,
    welcomeMessage: 'Welcome to Learn Connect! Find the best resources for your studies.',
  });
  const [editedSettings, setEditedSettings] = useState({...systemSettings});

  // Check for admin authentication on load
  useEffect(() => {
    const isAdminAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAdminAuthenticated) {
      navigate('/admin');
      toast({
        title: "Authentication required",
        description: "Please login to access the admin panel",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel",
    });
    navigate('/admin');
  };

  // Subject management functions
  const handleAddSubject = () => {
    if (!newSubject.trim()) {
      toast({
        title: "Error",
        description: "Subject name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    if (subjects.includes(newSubject.trim())) {
      toast({
        title: "Error",
        description: "Subject already exists",
        variant: "destructive",
      });
      return;
    }
    
    setSubjects([...subjects, newSubject.trim()]);
    setNewSubject('');
    
    toast({
      title: "Subject added",
      description: `"${newSubject.trim()}" has been added successfully`,
    });
  };
  
  const handleEditSubject = (index, originalName) => {
    toast({
      title: "Edit Subject",
      description: `Editing functionality for "${originalName}" will be available soon`,
    });
  };
  
  const handleDeleteSubject = (index, subjectName) => {
    const updatedSubjects = [...subjects];
    updatedSubjects.splice(index, 1);
    setSubjects(updatedSubjects);
    
    toast({
      title: "Subject deleted",
      description: `"${subjectName}" has been removed successfully`,
    });
  };

  // Content management functions
  const handleAddContent = () => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Upload Complete",
        description: "Content has been uploaded successfully",
      });
    }, 1500);
  };

  // User management functions
  const handleExportUsers = () => {
    setUserExportLoading(true);
    
    // Simulate export delay
    setTimeout(() => {
      setUserExportLoading(false);
      toast({
        title: "Users Exported",
        description: "User data has been exported successfully",
      });
    }, 1500);
  };

  // Settings functions
  const handleChangeAccessCode = () => {
    setIsChangingAccessCode(true);
  };
  
  const submitAccessCodeChange = () => {
    // Validate inputs
    if (!newAccessCode || !confirmAccessCode) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (newAccessCode !== confirmAccessCode) {
      toast({
        title: "Error",
        description: "New access codes do not match",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate processing delay
    setTimeout(() => {
      setCurrentAccessCode(newAccessCode);
      setNewAccessCode('');
      setConfirmAccessCode('');
      setIsChangingAccessCode(false);
      
      // Update in localStorage for persistence (in a real app, this would be server-side)
      localStorage.setItem('adminAccessCode', newAccessCode);
      
      toast({
        title: "Access Code Updated",
        description: "Admin access code has been changed successfully",
      });
    }, 1000);
  };
  
  const cancelAccessCodeChange = () => {
    setNewAccessCode('');
    setConfirmAccessCode('');
    setIsChangingAccessCode(false);
  };
  
  const handleConfigureSettings = () => {
    setEditedSettings({...systemSettings});
    setIsConfiguringSettings(true);
  };
  
  const handleSettingChange = (key, value) => {
    setEditedSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const saveSystemSettings = () => {
    // Validate settings
    if (!editedSettings.siteName || !editedSettings.contactEmail) {
      toast({
        title: "Error",
        description: "Site name and contact email are required",
        variant: "destructive",
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedSettings.contactEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    // Number validation
    if (isNaN(parseInt(editedSettings.maxUploadSize)) || parseInt(editedSettings.maxUploadSize) <= 0) {
      toast({
        title: "Error",
        description: "Max upload size must be a positive number",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate saving to server
    setTimeout(() => {
      setSystemSettings({...editedSettings});
      setIsConfiguringSettings(false);
      
      // In a real app, this would be saved to a database
      localStorage.setItem('systemSettings', JSON.stringify(editedSettings));
      
      toast({
        title: "Settings Updated",
        description: "System settings have been saved successfully",
      });
    }, 1000);
  };
  
  const cancelSettingsChanges = () => {
    setEditedSettings({...systemSettings});
    setIsConfiguringSettings(false);
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
                <div className="flex gap-2">
                  <Input 
                    placeholder="New subject name" 
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-48 md:w-64"
                  />
                  <Button onClick={handleAddSubject}>
                    <Book className="mr-2 h-4 w-4" />
                    Add Subject
                  </Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                {subjects.map((subject, index) => (
                  <Card key={`${subject}-${index}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{subject}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditSubject(index, subject)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteSubject(index, subject)}>Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Manage Content</h2>
                <Button onClick={handleAddContent} disabled={isUploading}>
                  {isUploading ? (
                    <>Uploading...</>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Content
                    </>
                  )}
                </Button>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Content Repository</CardTitle>
                </CardHeader>
                <CardContent>
                  {contentFiles.length > 0 ? (
                    <div className="space-y-2">
                      {contentFiles.map((file, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded">
                          <span>{file.name}</span>
                          <Button variant="destructive" size="sm">Remove</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-muted-foreground">
                      No content has been uploaded yet. Click "Upload Content" to add study materials.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Manage Users</h2>
                <Button variant="outline" onClick={handleExportUsers} disabled={userExportLoading}>
                  {userExportLoading ? (
                    <>Exporting...</>
                  ) : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Export Users
                    </>
                  )}
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
                <CardContent className="space-y-6">
                  <div className="border-b pb-6">
                    <h3 className="font-medium mb-4">Admin Access</h3>
                    
                    {isChangingAccessCode ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600">New Access Code</label>
                          <Input
                            type="password"
                            value={newAccessCode}
                            onChange={(e) => setNewAccessCode(e.target.value)}
                            placeholder="Enter new access code"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600">Confirm Access Code</label>
                          <Input
                            type="password"
                            value={confirmAccessCode}
                            onChange={(e) => setConfirmAccessCode(e.target.value)}
                            placeholder="Confirm new access code"
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button onClick={submitAccessCodeChange}>Save Changes</Button>
                          <Button variant="outline" onClick={cancelAccessCodeChange}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <Button onClick={handleChangeAccessCode}>
                        Change Access Code
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-4">System Preferences</h3>
                    
                    {isConfiguringSettings ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600">Site Name</label>
                          <Input
                            value={editedSettings.siteName}
                            onChange={(e) => handleSettingChange('siteName', e.target.value)}
                            placeholder="Site name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600">Contact Email</label>
                          <Input
                            type="email"
                            value={editedSettings.contactEmail}
                            onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                            placeholder="admin@example.com"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600">Max Upload Size (MB)</label>
                          <Input
                            type="number"
                            value={editedSettings.maxUploadSize}
                            onChange={(e) => handleSettingChange('maxUploadSize', e.target.value)}
                            placeholder="10"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="notificationsEnabled"
                            checked={editedSettings.notificationsEnabled}
                            onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
                            className="rounded"
                          />
                          <label htmlFor="notificationsEnabled" className="text-sm text-gray-600">
                            Enable Email Notifications
                          </label>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="maintenanceMode"
                            checked={editedSettings.maintenanceMode}
                            onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                            className="rounded"
                          />
                          <label htmlFor="maintenanceMode" className="text-sm text-gray-600">
                            Maintenance Mode
                          </label>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600">Welcome Message</label>
                          <Textarea
                            value={editedSettings.welcomeMessage}
                            onChange={(e) => handleSettingChange('welcomeMessage', e.target.value)}
                            placeholder="Welcome message for users"
                            rows={4}
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button onClick={saveSystemSettings}>Save Settings</Button>
                          <Button variant="outline" onClick={cancelSettingsChanges}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border rounded p-3">
                            <span className="text-sm text-gray-500">Site Name</span>
                            <p>{systemSettings.siteName}</p>
                          </div>
                          
                          <div className="border rounded p-3">
                            <span className="text-sm text-gray-500">Contact Email</span>
                            <p>{systemSettings.contactEmail}</p>
                          </div>
                          
                          <div className="border rounded p-3">
                            <span className="text-sm text-gray-500">Max Upload Size</span>
                            <p>{systemSettings.maxUploadSize} MB</p>
                          </div>
                          
                          <div className="border rounded p-3">
                            <span className="text-sm text-gray-500">Notifications</span>
                            <p>{systemSettings.notificationsEnabled ? 'Enabled' : 'Disabled'}</p>
                          </div>
                          
                          <div className="border rounded p-3">
                            <span className="text-sm text-gray-500">Maintenance Mode</span>
                            <p>{systemSettings.maintenanceMode ? 'Active' : 'Inactive'}</p>
                          </div>
                        </div>
                        
                        <div className="border rounded p-3">
                          <span className="text-sm text-gray-500">Welcome Message</span>
                          <p className="whitespace-pre-wrap">{systemSettings.welcomeMessage}</p>
                        </div>
                        
                        <Button variant="outline" onClick={handleConfigureSettings}>
                          Configure Settings
                        </Button>
                      </div>
                    )}
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

