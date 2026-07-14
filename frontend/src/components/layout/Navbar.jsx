import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useLayoutContext } from '../../context/LayoutContext';
import { ROUTES } from '../../constants/routes';
import { MdMenu, MdNotifications, MdKeyboardArrowDown, MdSettings, MdPerson, MdLogout, MdOutlineCircleNotifications } from 'react-icons/md';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { cn } from '../ui/Button';

const Navbar = () => {
  const { toggleMobileMenu } = useLayoutContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Breadcrumb logic
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  const handleLogout = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-white/90 backdrop-blur-md px-4 sm:gap-x-6 sm:px-6 lg:px-8 shadow-sm">
      <button 
        type="button" 
        className="-m-2.5 p-2.5 text-gray-500 lg:hidden hover:bg-gray-100 rounded-md transition-colors"
        onClick={toggleMobileMenu}
      >
        <span className="sr-only">Open sidebar</span>
        <MdMenu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 items-center">
        
        {/* Breadcrumb */}
        <div className="flex-1 flex items-center overflow-hidden">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              {pathnames.length === 0 ? (
                <li><span className="font-semibold text-gray-900">Dashboard</span></li>
              ) : (
                pathnames.map((value, index) => {
                  const isLast = index === pathnames.length - 1;
                  const title = value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ');
                  return (
                    <React.Fragment key={value}>
                      {index > 0 && <li><span className="text-gray-300">/</span></li>}
                      <li>
                        <span className={cn("font-semibold truncate max-w-[150px] sm:max-w-xs", isLast ? "text-gray-900" : "text-gray-500")}>
                          {title}
                        </span>
                      </li>
                    </React.Fragment>
                  );
                })
              )}
            </ol>
          </nav>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-x-3 lg:gap-x-5">
          
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              type="button" 
              className="relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
            >
              <span className="sr-only">View notifications</span>
              <MdNotifications className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white ring-1 ring-red-500 shadow-sm animate-pulse"></span>
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-border flex justify-between items-center">
                  <p className="text-sm font-semibold text-text">Notifications</p>
                  <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Mark all as read</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-4 flex gap-3 border-b border-border hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="mt-1 flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                      <MdOutlineCircleNotifications className="text-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">Batch scan completed</p>
                      <p className="text-xs text-gray-500 mt-0.5">120 OMR sheets evaluated successfully.</p>
                      <p className="text-xs text-gray-400 mt-1">2 mins ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 border-t border-border text-center">
                  <button className="text-xs font-medium text-primary hover:text-blue-700 p-2 w-full rounded-md hover:bg-blue-50 transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              type="button" 
              className="flex items-center p-1 focus:outline-none rounded-full lg:rounded-md lg:p-1.5 hover:bg-gray-50 transition-colors ring-1 ring-transparent hover:ring-gray-200"
              onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
            >
              <span className="sr-only">Open user menu</span>
              <Avatar src="https://i.pravatar.cc/150?u=admin" fallback="AD" size="sm" className="bg-primary/10 text-primary font-bold shadow-sm" />
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-3 text-sm font-medium text-text" aria-hidden="true">
                  Admin User
                </span>
                <MdKeyboardArrowDown className="ml-2 h-4 w-4 text-gray-400" aria-hidden="true" />
              </span>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-medium text-text">Admin User</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">admin@examvision.ai</p>
                </div>
                <div className="py-1">
                  <Link to={ROUTES.DASHBOARD} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                    <MdPerson className="mr-3 h-4 w-4 text-gray-400 group-hover:text-primary" /> My Profile
                  </Link>
                  <Link to={ROUTES.DASHBOARD} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                    <MdSettings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-primary" /> Account Settings
                  </Link>
                </div>
                <div className="py-1 border-t border-border">
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <MdLogout className="mr-3 h-4 w-4 text-red-500" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export { Navbar };
