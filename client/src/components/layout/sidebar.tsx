import { Link } from "wouter";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

const Sidebar = ({ isOpen, onClose, currentPath }: SidebarProps) => {
  return (
    <aside 
      className={`bg-white shadow-md fixed inset-y-0 left-0 z-20 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center space-x-2">
          <div className="bg-primary-500 text-white p-1.5 rounded">
            <i className="ri-virus-line text-xl"></i>
          </div>
          <span className="text-xl font-bold text-primary-500">ResisTrack</span>
        </div>
        <button 
          onClick={onClose} 
          className="lg:hidden text-neutral-500 hover:text-neutral-700"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>
      </div>
      
      {/* Navigation Links */}
      <nav className="mt-2 px-2 space-y-1">
        <Link href="/" className={`flex items-center px-4 py-3 text-sm font-medium ${
            currentPath === "/" 
              ? "text-white bg-primary-500" 
              : "text-neutral-700 hover:bg-primary-50 hover:text-primary-500"
          } rounded-md`}>
          <i className="ri-dashboard-line mr-3 text-lg"></i>
          Dashboard
        </Link>

        <Link href="/map" className={`flex items-center px-4 py-3 text-sm font-medium ${
            currentPath === "/map" 
              ? "text-white bg-primary-500" 
              : "text-neutral-700 hover:bg-primary-50 hover:text-primary-500"
          } rounded-md`}>
          <i className="ri-map-2-line mr-3 text-lg"></i>
          Geographic Map
        </Link>

        <Link href="/analysis" className={`flex items-center px-4 py-3 text-sm font-medium ${
            currentPath === "/analysis" 
              ? "text-white bg-primary-500" 
              : "text-neutral-700 hover:bg-primary-50 hover:text-primary-500"
          } rounded-md`}>
          <i className="ri-bar-chart-grouped-line mr-3 text-lg"></i>
          Analysis Tools
        </Link>

        <Link href="/import" className={`flex items-center px-4 py-3 text-sm font-medium ${
            currentPath === "/import" 
              ? "text-white bg-primary-500" 
              : "text-neutral-700 hover:bg-primary-50 hover:text-primary-500"
          } rounded-md`}>
          <i className="ri-file-upload-line mr-3 text-lg"></i>
          Data Import
        </Link>

        <Link href="/reports" className={`flex items-center px-4 py-3 text-sm font-medium ${
            currentPath === "/reports" 
              ? "text-white bg-primary-500" 
              : "text-neutral-700 hover:bg-primary-50 hover:text-primary-500"
          } rounded-md`}>
          <i className="ri-file-chart-line mr-3 text-lg"></i>
          Reports
        </Link>

        <Link href="/resources" className={`flex items-center px-4 py-3 text-sm font-medium ${
            currentPath === "/resources" 
              ? "text-white bg-primary-500" 
              : "text-neutral-700 hover:bg-primary-50 hover:text-primary-500"
          } rounded-md`}>
          <i className="ri-book-open-line mr-3 text-lg"></i>
          Resources
        </Link>

        <Link href="/settings" className={`flex items-center px-4 py-3 text-sm font-medium ${
            currentPath === "/settings" 
              ? "text-white bg-primary-500" 
              : "text-neutral-700 hover:bg-primary-50 hover:text-primary-500"
          } rounded-md`}>
          <i className="ri-settings-4-line mr-3 text-lg"></i>
          Settings
        </Link>
      </nav>
      
      {/* User Profile */}
      <div className="absolute bottom-0 w-full border-t border-neutral-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
              <span className="font-medium text-sm">JD</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-neutral-800">Dr. Jane Doe</p>
            <p className="text-xs text-neutral-500">Infectious Disease Specialist</p>
          </div>
          <div className="ml-auto">
            <button className="text-neutral-400 hover:text-neutral-600">
              <i className="ri-logout-box-r-line"></i>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
