import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import GeographicMap from "@/pages/geographic-map";
import Analysis from "@/pages/analysis";
import DataImport from "@/pages/data-import";
import Reports from "@/pages/reports";
import Resources from "@/pages/resources";
import Settings from "@/pages/settings";
import Sidebar from "@/components/layout/sidebar";
import MobileNavigation from "@/components/layout/mobile-navigation";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/map" component={GeographicMap} />
      <Route path="/analysis" component={Analysis} />
      <Route path="/import" component={DataImport} />
      <Route path="/reports" component={Reports} />
      <Route path="/resources" component={Resources} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  // Get the current page title based on the route
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/map":
        return "Geographic Map";
      case "/analysis":
        return "Analysis Tools";
      case "/import":
        return "Data Import";
      case "/reports":
        return "Reports";
      case "/resources":
        return "Resources";
      case "/settings":
        return "Settings";
      default:
        return "Not Found";
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} currentPath={location} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm z-10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)} 
                  className="lg:hidden text-neutral-500 hover:text-neutral-700"
                >
                  <i className="ri-menu-line text-2xl"></i>
                </button>
                <h1 className="text-xl font-semibold text-neutral-800 hidden sm:block">
                  {getPageTitle()}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative hidden md:block">
                  <input 
                    type="text" 
                    placeholder="Search resistance data..." 
                    className="w-64 pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-search-line text-neutral-400"></i>
                  </div>
                </div>
                
                {/* Notifications */}
                <button className="relative p-1 rounded-full text-neutral-400 hover:text-neutral-600 focus:outline-none">
                  <i className="ri-notification-3-line text-xl"></i>
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>
                
                {/* Help */}
                <button className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 focus:outline-none">
                  <i className="ri-question-line text-xl"></i>
                </button>
              </div>
            </div>
          </header>
          
          <Router />
        </div>
      </div>
      
      <MobileNavigation currentPath={location} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
