import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { NAVIGATION } from '../../constants/navigation';
import { ROUTES } from '../../constants/routes';
import { useLayoutContext } from '../../context/LayoutContext';
import { MdLogout, MdClose, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { cn } from '../ui/Button';

const Sidebar = () => {
  const { isSidebarCollapsed, toggleSidebar, isMobileMenuOpen, closeMobileMenu } = useLayoutContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    closeMobileMenu();
    navigate(ROUTES.HOME);
  };

  const navContent = (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-border bg-cards">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="h-8 w-8 shrink-0 bg-primary rounded-md flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">EV</span>
          </div>
          <span 
            className={cn(
              "font-bold text-lg text-primary whitespace-nowrap transition-all duration-300 ease-in-out origin-left",
              isSidebarCollapsed ? "opacity-0 scale-x-0 w-0" : "opacity-100 scale-x-100 w-auto"
            )}
          >
            ExamVision AI
          </span>
        </div>
        <button 
          onClick={closeMobileMenu} 
          className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
        >
          <MdClose className="text-xl" />
        </button>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-6 overflow-y-auto custom-scrollbar">
        {NAVIGATION.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) => cn(
                'group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 relative overflow-hidden',
                isActive 
                  ? 'bg-blue-50/80 text-primary shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              {({ isActive }) => (
                <>
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                  )}
                  
                  <Icon 
                    className={cn(
                      'shrink-0 text-xl transition-all duration-300',
                      isSidebarCollapsed ? 'mx-auto' : 'mr-3',
                      isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'
                    )} 
                  />
                  
                  <span 
                    className={cn(
                      "whitespace-nowrap transition-all duration-300 ease-in-out origin-left",
                      isSidebarCollapsed ? "opacity-0 scale-x-0 w-0 hidden" : "opacity-100 scale-x-100 w-auto block"
                    )}
                  >
                    {item.label}
                  </span>
                  
                  {/* Tooltip for collapsed state */}
                  {isSidebarCollapsed && (
                    <div className="fixed left-[72px] ml-2 hidden lg:group-hover:flex items-center z-[60]">
                      <div className="bg-gray-900 text-white text-xs py-1.5 px-3 rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {item.label}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-[5px] border-transparent border-r-gray-900"></div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border shrink-0 bg-gray-50/50">
        <button 
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 relative group',
            isSidebarCollapsed ? 'justify-center' : ''
          )}
        >
          <MdLogout className={cn('shrink-0 text-xl transition-all duration-300', isSidebarCollapsed ? 'mr-0' : 'mr-3')} />
          <span 
            className={cn(
              "whitespace-nowrap transition-all duration-300 ease-in-out origin-left",
              isSidebarCollapsed ? "opacity-0 scale-x-0 w-0 hidden" : "opacity-100 scale-x-100 w-auto block"
            )}
          >
            Logout
          </span>
          
          {isSidebarCollapsed && (
            <div className="fixed left-[72px] ml-2 hidden lg:group-hover:flex items-center z-[60]">
              <div className="bg-gray-900 text-white text-xs py-1.5 px-3 rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Logout
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-[5px] border-transparent border-r-gray-900"></div>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Desktop Collapse Toggle */}
      <button 
        onClick={toggleSidebar}
        className="hidden lg:flex absolute -right-3.5 top-20 h-7 w-7 items-center justify-center rounded-full border border-border bg-white text-gray-400 shadow-sm hover:text-primary hover:border-primary hover:bg-blue-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 z-10"
      >
        {isSidebarCollapsed ? <MdChevronRight className="text-lg" /> : <MdChevronLeft className="text-lg" />}
      </button>
    </>
  );

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-cards border-r border-border transition-all duration-300 ease-in-out shadow-sm',
          /* Mobile classes */
          isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0',
          /* Desktop classes */
          isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        )}
      >
        {navContent}
      </aside>
    </>
  );
};

export { Sidebar };
