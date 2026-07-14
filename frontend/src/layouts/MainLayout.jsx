import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { LayoutProvider, useLayoutContext } from '../context/LayoutContext';
import { cn } from '../components/ui/Button';

const MainLayoutContent = () => {
  const { isSidebarCollapsed } = useLayoutContext();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main Content Wrapper - adjust margin based on sidebar state */}
      <div 
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="mx-auto max-w-7xl w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const MainLayout = () => {
  return (
    <LayoutProvider>
      <MainLayoutContent />
    </LayoutProvider>
  );
};

export default MainLayout;
