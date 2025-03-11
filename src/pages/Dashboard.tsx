import { Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubjectCard from '@/components/SubjectCard';
import ContentRequestForm from '@/components/ContentRequestForm';
import Sidebar from '@/components/dashboard/Sidebar';
import MobileNav from '@/components/dashboard/MobileNav';
import UserStats from '@/components/dashboard/UserStats';
import ActivityList from '@/components/dashboard/ActivityList';
import { useDashboard } from '@/hooks/useDashboard';

const Dashboard = () => {
  const {
    activeTab,
    setActiveTab,
    userProfile,
    userStats,
    isLoading,
    subjects,
    recentActivityData,
    handleLogout,
    handleSettingsClick,
    handleSavedClick,
    handleActivityClick
  } = useDashboard();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onSettingsClick={handleSettingsClick}
        onSavedClick={handleSavedClick}
      />
      
      <MobileNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSettingsClick={handleSettingsClick} 
      />
      
      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-72" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-2">
                  Welcome back, {userProfile?.full_name || userProfile?.username || 'User'}
                </h1>
                <p className="text-gray-600">
                  Get help with your assignments and study materials
                </p>
              </>
            )}
          </header>
          
          <UserStats isLoading={isLoading} statsData={userStats} />
          
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
                    name={subject.name}
                    description={subject.description}
                    icon={
                      subject.icon === 'BarChart' ? (
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="20" x2="18" y2="10"></line>
                          <line x1="12" y1="20" x2="12" y2="4"></line>
                          <line x1="6" y1="20" x2="6" y2="14"></line>
                        </svg>
                      ) : subject.icon === 'Book' ? (
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                      ) : subject.icon === 'BookOpen' ? (
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 3h6a4 4 0 0 1 4 4v16a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v16a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                      ) : (
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      )
                    }
                    href={`#${(subject.title || subject.name).toLowerCase().replace(/\s+/g, '-')}`}
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
              <ActivityList 
                activities={recentActivityData} 
                onActivityClick={handleActivityClick} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
