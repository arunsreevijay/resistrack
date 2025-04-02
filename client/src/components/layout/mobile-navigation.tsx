import { Link } from "wouter";

interface MobileNavigationProps {
  currentPath: string;
}

const MobileNavigation = ({ currentPath }: MobileNavigationProps) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-20">
      <div className="flex justify-around">
        <Link href="/" className={`flex flex-col items-center py-2 px-4 ${
            currentPath === "/" ? "text-primary-500" : "text-neutral-500"
          }`}>
            <i className="ri-dashboard-line text-xl"></i>
            <span className="text-xs mt-1">Dashboard</span>
        </Link>
        
        <Link href="/map" className={`flex flex-col items-center py-2 px-4 ${
            currentPath === "/map" ? "text-primary-500" : "text-neutral-500"
          }`}>
            <i className="ri-map-2-line text-xl"></i>
            <span className="text-xs mt-1">Map</span>
        </Link>
        
        <Link href="/analysis" className={`flex flex-col items-center py-2 px-4 ${
            currentPath === "/analysis" ? "text-primary-500" : "text-neutral-500"
          }`}>
            <i className="ri-bar-chart-grouped-line text-xl"></i>
            <span className="text-xs mt-1">Analysis</span>
        </Link>
        
        <Link href="/resources" className={`flex flex-col items-center py-2 px-4 ${
            currentPath === "/resources" ? "text-primary-500" : "text-neutral-500"
          }`}>
            <i className="ri-book-open-line text-xl"></i>
            <span className="text-xs mt-1">Resources</span>
        </Link>
        
        <Link href="/settings" className={`flex flex-col items-center py-2 px-4 ${
            currentPath === "/settings" ? "text-primary-500" : "text-neutral-500"
          }`}>
            <i className="ri-user-line text-xl"></i>
            <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;
