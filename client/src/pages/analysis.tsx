import { useState } from "react";
import { FilterState } from "@shared/schema";
import FilterBar from "@/components/filters/filter-bar";
import ResistanceTrendsChart from "@/components/dashboard/resistance-trends-chart";
import AntibioticEffectivenessWidget from "@/components/dashboard/antibiotic-effectiveness-widget";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Analysis = () => {
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
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Resistance Analysis Tools</CardTitle>
            <CardDescription>
              In-depth analysis tools for antimicrobial resistance data. 
              Use the filters above to refine your analysis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Resistance Trends Over Time</h3>
                <ResistanceTrendsChart filters={filters} />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">Antibiotic Effectiveness</h3>
                <AntibioticEffectivenessWidget filters={filters} />
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Advanced Analysis Tools</h3>
              <div className="bg-neutral-50 p-8 rounded-md border border-neutral-200 text-center">
                <i className="ri-line-chart-line text-4xl text-primary-500 mb-2"></i>
                <h4 className="text-xl font-semibold">Coming Soon</h4>
                <p className="text-neutral-600 mt-2">Advanced statistical analysis and predictive modeling tools are under development.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default Analysis;
