import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, History, Settings, LogOut, Book, ChevronRight, Bookmark, Clock, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import SubjectCard from '@/components/SubjectCard';
import ContentRequestForm from '@/components/ContentRequestForm';

const subjects = [
  {
    id: 1,
    title: 'Mathematics',
    description: 'Calculus, Algebra, Statistics, and more',
    icon: <BarChart className="h-6 w-6" />,
    href: '#'
  },
  {
    id: 2,
    title: 'Computer Science',
    description: 'Programming, Algorithms, Data Structures',
    icon: <Book className="h-6 w-6" />,
    href: '#'
  },
  {
    id: 3,
    title: 'Physics',
    description: 'Mechanics, Thermodynamics, Electromagnetism',
    icon: <BookOpen className="h-6 w-6" />,
    href: '#'
  },
  {
    id: 4,
    title: 'Literature',
    description: 'Essays, Analysis, Research Papers',
    icon: <FileText className="h-6 w-6" />,
    href: '#'
  }
];

const recentActivityData = [
  {
    id: 1,
    title: 'Physics Assignment',
    subject: 'Physics',
    date: '2 hours ago',
    type: 'assignment'
  },
  {
    id: 2,
    title: 'Calculus Notes',
    subject: 'Mathematics',
    date: 'Yesterday',
    type: 'notes'
  },
  {
    id: 3,
    title: 'Data Structures Review',
    subject: 'Computer Science',
    date: '3 days ago',
    type: 'notes'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('subjects');
  
  const handleLogout = () => {
    toast.success('Successfully logged out');
    navigate('/');
  };
  
  const handleSettingsClick = () => {
    toast.info('Settings will be available in the next update');
  };
  
  const handleSavedClick = () => {
    toast.info('Saved materials will be available in the next update');
  };
  
  const handleActivityClick = (activity: { title: string; type: string }) => {
    toast.info(`Opening ${activity.title}`);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center gap-2 text-xl font-semibold px-2 py-4">
          <span className="bg-purple-500 text-white p-1 rounded">LC</span>
          <span>LearnCraftify</span>
        </div>
        
        <nav className="mt-8 flex flex-col gap-2 flex-1">
          <Button variant="ghost" className="justify-start gap-3" onClick={() => setActiveTab('subjects')}>
            <BookOpen className="h-5 w-5" />
            Subjects
          </Button>
          <Button variant="ghost" className="justify-start gap-3" onClick={() => setActiveTab('request')}>
            <FileText className="h-5 w-5" />
            Request Content
          </Button>
          <Button variant="ghost" className="justify-start gap-3" onClick={() => setActiveTab('history')}>
            <History className="h-5 w-5" />
            History
          </Button>
          <Button variant="ghost" className="justify-start gap-3" onClick={handleSavedClick}>
            <Bookmark className="h-5 w-5" />
            Saved
          </Button>
          <Button variant="ghost" className="justify-start gap-3" onClick={handleSettingsClick}>
            <Settings className="h-5 w-5" />
            Settings
          </Button>
        </nav>
        
        <Button variant="outline" className="mt-auto justify-start gap-3" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </aside>
      
      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-10 md:hidden bg-white border-t border-gray-200">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex-1 flex-col py-3 h-auto rounded-none" onClick={() => setActiveTab('subjects')}>
            <BookOpen className="h-5 w-5 mb-1" />
            <span className="text-xs">Subjects</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex-col py-3 h-auto rounded-none" onClick={() => setActiveTab('request')}>
            <FileText className="h-5 w-5 mb-1" />
            <span className="text-xs">Request</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex-col py-3 h-auto rounded-none" onClick={() => setActiveTab('history')}>
            <History className="h-5 w-5 mb-1" />
            <span className="text-xs">History</span>
          </Button>
          <Button variant="ghost" className="flex-1 flex-col py-3 h-auto rounded-none" onClick={handleSettingsClick}>
            <Settings className="h-5 w-5 mb-1" />
            <span className="text-xs">Settings</span>
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome back, Alex</h1>
            <p className="text-gray-600">
              Get help with your assignments and study materials
            </p>
          </header>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Generated Documents', value: '24', icon: <FileText className="h-5 w-5 text-purple-500" /> },
              { label: 'Saved Documents', value: '12', icon: <Bookmark className="h-5 w-5 text-purple-500" /> },
              { label: 'Subjects', value: '8', icon: <Book className="h-5 w-5 text-purple-500" /> },
              { label: 'Usage Time', value: '18h', icon: <Clock className="h-5 w-5 text-purple-500" /> }
            ].map((stat, index) => (
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="request">Request Content</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="subjects" className="animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {subjects.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    title={subject.title}
                    description={subject.description}
                    icon={subject.icon}
                    href={`#${subject.title.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="request" className="animate-fade-in">
              <div className="max-w-xl mx-auto">
                <ContentRequestForm />
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                
                {recentActivityData.map((item) => (
                  <Card 
                    key={item.id} 
                    className="hover-lift cursor-pointer"
                    onClick={() => handleActivityClick(item)}
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
