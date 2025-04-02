import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bacteria, Antibiotic, Region, FilterState } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface FilterBarProps {
  filters: Partial<FilterState>;
  onFilterChange: (filters: Partial<FilterState>) => void;
}

const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  // Local state for dropdowns
  const [bacteriaOpen, setBacteriaOpen] = useState(false);
  const [antibioticOpen, setAntibioticOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  // Fetch filter options
  const { data: bacteriaData, isLoading: bacteriaLoading } = useQuery<Bacteria[]>({
    queryKey: ['/api/bacteria'],
  });

  const { data: antibioticData, isLoading: antibioticLoading } = useQuery<Antibiotic[]>({
    queryKey: ['/api/antibiotics'],
  });

  const { data: regionData, isLoading: regionLoading } = useQuery<Region[]>({
    queryKey: ['/api/regions'],
  });

  // Handle filter selection
  const handleBacteriaChange = (id?: number) => {
    onFilterChange({ ...filters, bacteriaId: id });
    setBacteriaOpen(false);
  };

  const handleAntibioticChange = (id?: number) => {
    onFilterChange({ ...filters, antibioticId: id });
    setAntibioticOpen(false);
  };

  const handleRegionChange = (id?: number) => {
    onFilterChange({ ...filters, regionId: id });
    setRegionOpen(false);
  };

  const handleTimeChange = (period: string) => {
    onFilterChange({ ...filters, timePeriod: period });
    setTimeOpen(false);
  };

  const resetFilters = () => {
    onFilterChange({ timePeriod: '12m' });
  };

  // Helper function to get the display name for selected filters
  const getSelectedBacteriaName = () => {
    if (!filters.bacteriaId) return "All Bacteria";
    if (bacteriaLoading) return "Loading...";
    
    const bacteria = bacteriaData?.find(b => b.id === filters.bacteriaId);
    return bacteria ? bacteria.name : "All Bacteria";
  };

  const getSelectedAntibioticName = () => {
    if (!filters.antibioticId) return "All Antibiotics";
    if (antibioticLoading) return "Loading...";
    
    const antibiotic = antibioticData?.find(a => a.id === filters.antibioticId);
    return antibiotic ? antibiotic.name : "All Antibiotics";
  };

  const getSelectedRegionName = () => {
    if (!filters.regionId) return "All Regions";
    if (regionLoading) return "Loading...";
    
    const region = regionData?.find(r => r.id === filters.regionId);
    return region ? region.name : "All Regions";
  };

  const getSelectedTimePeriodName = () => {
    switch (filters.timePeriod) {
      case '3m': return "Last 3 Months";
      case '6m': return "Last 6 Months";
      case '12m': return "Last 12 Months";
      case '2y': return "Last 2 Years";
      case '5y': return "Last 5 Years";
      case 'custom': return "Custom Range";
      default: return "Last 12 Months";
    }
  };

  return (
    <div className="border-t border-neutral-200 px-4 py-3 bg-neutral-50 flex flex-wrap items-center gap-3">
      <div className="text-sm font-medium text-neutral-600 mr-2">Filter by:</div>
      
      {/* Bacteria Type Filter */}
      <div className="relative inline-block text-left">
        <button 
          onClick={() => setBacteriaOpen(!bacteriaOpen)} 
          type="button" 
          className="inline-flex justify-between w-40 rounded-md border border-neutral-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        >
          {bacteriaLoading ? <Skeleton className="h-4 w-20" /> : getSelectedBacteriaName()}
          <i className="ri-arrow-down-s-line ml-2"></i>
        </button>
        {bacteriaOpen && (
          <div 
            className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-neutral-100 z-20"
            onClick={() => setBacteriaOpen(false)}
          >
            <div className="py-1">
              <button
                onClick={() => handleBacteriaChange(undefined)}
                className="text-neutral-700 block px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-500 w-full text-left"
              >
                All Bacteria
              </button>
              
              {bacteriaLoading ? (
                <div className="px-4 py-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-full mt-2" />
                </div>
              ) : (
                bacteriaData?.map(bacteria => (
                  <button
                    key={bacteria.id}
                    onClick={() => handleBacteriaChange(bacteria.id)}
                    className="text-neutral-700 block px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-500 w-full text-left"
                  >
                    {bacteria.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Antibiotic Filter */}
      <div className="relative inline-block text-left">
        <button 
          onClick={() => setAntibioticOpen(!antibioticOpen)} 
          type="button" 
          className="inline-flex justify-between w-40 rounded-md border border-neutral-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        >
          {antibioticLoading ? <Skeleton className="h-4 w-20" /> : getSelectedAntibioticName()}
          <i className="ri-arrow-down-s-line ml-2"></i>
        </button>
        {antibioticOpen && (
          <div 
            className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-neutral-100 z-20"
            onClick={() => setAntibioticOpen(false)}
          >
            <div className="py-1">
              <button
                onClick={() => handleAntibioticChange(undefined)}
                className="text-neutral-700 block px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-500 w-full text-left"
              >
                All Antibiotics
              </button>
              
              {antibioticLoading ? (
                <div className="px-4 py-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-full mt-2" />
                </div>
              ) : (
                antibioticData?.map(antibiotic => (
                  <button
                    key={antibiotic.id}
                    onClick={() => handleAntibioticChange(antibiotic.id)}
                    className="text-neutral-700 block px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-500 w-full text-left"
                  >
                    {antibiotic.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Region Filter */}
      <div className="relative inline-block text-left">
        <button 
          onClick={() => setRegionOpen(!regionOpen)} 
          type="button" 
          className="inline-flex justify-between w-40 rounded-md border border-neutral-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        >
          {regionLoading ? <Skeleton className="h-4 w-20" /> : getSelectedRegionName()}
          <i className="ri-arrow-down-s-line ml-2"></i>
        </button>
        {regionOpen && (
          <div 
            className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-neutral-100 z-20"
            onClick={() => setRegionOpen(false)}
          >
            <div className="py-1">
              <button
                onClick={() => handleRegionChange(undefined)}
                className="text-neutral-700 block px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-500 w-full text-left"
              >
                All Regions
              </button>
              
              {regionLoading ? (
                <div className="px-4 py-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-full mt-2" />
                </div>
              ) : (
                regionData?.map(region => (
                  <button
                    key={region.id}
                    onClick={() => handleRegionChange(region.id)}
                    className="text-neutral-700 block px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-500 w-full text-left"
                  >
                    {region.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Time Period Filter */}
      <div className="relative inline-block text-left">
        <button 
          onClick={() => setTimeOpen(!timeOpen)} 
          type="button" 
          className="inline-flex justify-between w-40 rounded-md border border-neutral-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        >
          {getSelectedTimePeriodName()}
          <i className="ri-arrow-down-s-line ml-2"></i>
        </button>
        {timeOpen && (
          <div 
            className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-neutral-100 z-20"
            onClick={() => setTimeOpen(false)}
          >
            <div className="py-1">
              <button
                onClick={() => handleTimeChange('3m')}
                className="text-neutral-700 block px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-500 w-full text-left"
              >
                Last 3 Months
              </button>
              <button
                onClick={() => handleTimeChange('6m')}
                className="text-neutral-700 block px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-500 w-full text-left"
              >
                Last 6 Months
              </button>
              <button
                onClick={() => handleTimeChange('12m')}
                className="text-neutral-700 block px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-500 w-full text-left"
              >
                Last 12 Months
              </button>
              <button
                onClick={() => handleTimeChange('2y')}
                className="text-neutral-700 block px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-500 w-full text-left"
              >
                Last 2 Years
              </button>
              <button
                onClick={() => handleTimeChange('5y')}
                className="text-neutral-700 block px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-500 w-full text-left"
              >
                Last 5 Years
              </button>
              <button
                onClick={() => handleTimeChange('custom')}
                className="text-neutral-700 block px-4 py-2 text-sm hover:bg-primary-50 hover:text-primary-500 w-full text-left"
              >
                Custom Range
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Reset Button */}
      <button 
        onClick={resetFilters}
        className="ml-auto text-sm text-primary-600 hover:text-primary-800 font-medium"
      >
        <i className="ri-refresh-line mr-1"></i> Reset Filters
      </button>
    </div>
  );
};

export default FilterBar;
