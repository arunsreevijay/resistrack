import { useState } from "react";
import { FilterState } from "@shared/schema";
import FilterBar from "@/components/filters/filter-bar";
import GeographicMap from "@/components/dashboard/geographic-map";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const GeographicMapPage = () => {
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
            <CardTitle>Geographic Resistance Map</CardTitle>
            <CardDescription>
              Visualize antimicrobial resistance patterns across different geographic regions.
              Use the filters above to refine the data displayed on the map.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[600px]">
              <GeographicMap filters={filters} />
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default GeographicMapPage;
