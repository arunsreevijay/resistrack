import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

interface TopNavigationProps {
  title: string;
  toggleSidebar: () => void;
}

const TopNavigation = ({ title, toggleSidebar }: TopNavigationProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic (would redirect to search results page in a full implementation)
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleSidebar} 
            className="lg:hidden text-neutral-500 hover:text-neutral-700 focus:outline-none"
            aria-label="Toggle sidebar menu"
          >
            <i className="ri-menu-line text-2xl"></i>
          </button>
          <h1 className="text-xl font-semibold text-neutral-800 hidden sm:block">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Input
              type="text"
              placeholder="Search resistance data..."
              className="w-64 pl-10 pr-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search resistance data"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-search-line text-neutral-400"></i>
            </div>
          </form>
          
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full text-neutral-400 hover:text-neutral-600 focus:ring-2 focus:ring-primary-500"
            aria-label="Notifications"
          >
            <i className="ri-notification-3-line text-xl"></i>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" aria-hidden="true"></span>
          </Button>
          
          {/* Help */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-neutral-400 hover:text-neutral-600 focus:ring-2 focus:ring-primary-500"
            aria-label="Help"
          >
            <i className="ri-question-line text-xl"></i>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
