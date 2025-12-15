import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Folder, User, Lock, LogOut } from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Article management",
      path: "/admin/article-management",
      icon: FileText,
    },
    {
      name: "Category management",
      path: "/admin/category-management",
      icon: Folder,
    },
    { name: "Profile", path: "/admin/profile", icon: User },
    { name: "Reset password", path: "/admin/reset-password", icon: Lock },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex w-full h-screen bg-[#F8F5F0]">
      <aside className="w-[280px] bg-[#EFEEEB] py-18 border-r flex flex-col">
        <div className="flex flex-col items-start gap-2 p-6">
          <a href="/" className="text-4xl font-semibold text-[#333333] mx-0">
            hh
            <span className="text-2xl font-bold text-[#059729]">.</span>
          </a>
          <p className="text-xl text-[#E0915B]">Admin panel</p>
        </div>
        <nav className="flex flex-col items-start gap-2 mt-6 flex-1">
          <ul className="flex flex-col items-start gap-0 w-full">
            {menuItems.map((item) => (
              <li key={item.name} className="w-full">
                <Link
                  to={item.path}
                  className={`flex items-center px-6 py-5 rounded-none ${
                    location.pathname === item.path
                      ? "bg-[#DAD6D1] text-[#333333] font-medium"
                      : "text-[#75716B] hover:bg-[#DAD6D1]"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-6 border-t">
          <a
            href="/"
            className="flex items-center text-[#75716B] hover:text-[#c97a4a] mb-4"
          >
            <Home className="w-5 h-5 mr-3" />
            hh. website
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-[#75716B] hover:text-[#2a2a2a]"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;


