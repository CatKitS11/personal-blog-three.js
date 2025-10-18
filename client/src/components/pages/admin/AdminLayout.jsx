import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, FileText, Folder, User, Bell, Lock, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Article management', path: '/admin/article-management', icon: FileText },
    { name: 'Category management', path: '/admin/category-management', icon: Folder },
    { name: 'Profile', path: '/admin/profile', icon: User },
    { name: 'Notification', path: '/admin/notification', icon: Bell },
    { name: 'Reset password', path: '/admin/reset-password', icon: Lock },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold">hh.</h1>
          <p className="text-sm text-gray-500">Admin panel</p>
        </div>
        <nav className="mt-6">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name} className="px-4">
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-gray-700 rounded-md ${
                    location.pathname === item.path ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
            <a href="/" className="flex items-center text-gray-700 hover:text-gray-900">
                <Home className="w-5 h-5 mr-3" />
                hh.website
            </a>
            <button className="flex items-center w-full mt-4 text-left text-gray-700 hover:text-gray-900">
                <LogOut className="w-5 h-5 mr-3" />
                Log out
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;