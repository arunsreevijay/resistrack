import { useState } from "react";
import { FilterState } from "@shared/schema";
import DashboardSummary from "@/components/dashboard/dashboard-summary";
import ResistanceTrendsChart from "@/components/dashboard/resistance-trends-chart";
import GeographicMap from "@/components/dashboard/geographic-map";
import AlertsWidget from "@/components/dashboard/alerts-widget";
import AntibioticEffectivenessWidget from "@/components/dashboard/antibiotic-effectiveness-widget";
import ResourcesWidget from "@/components/dashboard/resources-widget";
import FilterBar from "@/components/filters/filter-bar";

const Dashboard = () => {
  // State for filters
  const [filters, setFilters] = useState<Partial<FilterState>>({
    timePeriod: '12m',
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(newFilters);
  };

  return (
    <>
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      
      <main className="flex-1 overflow-y-auto bg-neutral-100 p-4 md:p-6">
        {/* Dashboard Summary Cards */}
        <DashboardSummary filters={filters} />
        
        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trend Charts */}
          <div className="lg:col-span-2 space-y-6">
            <ResistanceTrendsChart filters={filters} />
            <GeographicMap filters={filters} />
          </div>
          
          {/* Right Column - Analysis and Alerts */}
          <div className="space-y-6">
            <AlertsWidget />
            <AntibioticEffectivenessWidget filters={filters} />
            <ResourcesWidget />
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
