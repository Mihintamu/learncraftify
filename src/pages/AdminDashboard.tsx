
import { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminContent from '@/components/admin/AdminContent';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('subjects');
  const { handleLogout } = useAdminAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleLogout={handleLogout} 
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header Component */}
        <AdminHeader handleLogout={handleLogout} />
        
        {/* Content area */}
        <AdminContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default AdminDashboard;
