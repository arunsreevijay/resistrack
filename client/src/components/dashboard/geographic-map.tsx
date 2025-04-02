import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterState, ResistanceData } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";

interface GeographicMapProps {
  filters: Partial<FilterState>;
}

// Simple world map GeoJSON
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const GeographicMap = ({ filters }: GeographicMapProps) => {
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({ coordinates: [0, 0], zoom: 1 });

  const { data, isLoading, error } = useQuery<ResistanceData[]>({
    queryKey: ['/api/resistance-data', filters],
  });

  // Calculate resistance rates by region
  const resistanceByRegion = new Map<number, { total: number, resistant: number, rate: number }>();
  
  if (data) {
    for (const item of data) {
      if (!resistanceByRegion.has(item.regionId)) {
        resistanceByRegion.set(item.regionId, { total: 0, resistant: 0, rate: 0 });
      }
      
      const stats = resistanceByRegion.get(item.regionId)!;
      stats.total += item.totalSamples;
      stats.resistant += item.resistantSamples;
    }
    
    // Calculate rates
    resistanceByRegion.forEach((stats, regionId) => {
      stats.rate = stats.total > 0 ? (stats.resistant / stats.total) * 100 : 0;
    });
  }

  // Color scale for resistance rates
  const colorScale = scaleQuantize<string>()
    .domain([0, 100])
    .range([
      "#a8e6cf", // Very low
      "#ffd3b6", // Low
      "#ffaaa5", // Medium
      "#ff8b94", // High
      "#ff6b6b"  // Very high
    ]);

  // Default fill for countries with no data
  const defaultFill = "#f5f5f5";

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
          <CardDescription>Resistance hotspots by region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-100 p-4 rounded-lg text-red-700">
            Error loading geographic data: {(error as Error).message}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleMoveEnd = (position: { coordinates: [number, number]; zoom: number }) => {
    setPosition(position);
  };

  return (
    <Card>
      <CardHeader className="border-b border-neutral-200 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Geographic Distribution</CardTitle>
          <div className="flex items-center space-x-2">
            <button className="text-sm text-neutral-500 hover:text-neutral-700">
              <i className="ri-fullscreen-line"></i>
            </button>
            <button className="text-sm text-neutral-500 hover:text-neutral-700">
              <i className="ri-download-line"></i>
            </button>
          </div>
        </div>
        <CardDescription>Resistance hotspots by region</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="h-80 w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <>
            <div className="relative h-80 bg-neutral-50 rounded-lg border border-neutral-200">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 100 }}
              >
                <ZoomableGroup
                  zoom={position.zoom}
                  center={position.coordinates}
                  onMoveEnd={handleMoveEnd}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        // Map countries to regions based on region code
                        // For simplification, we'll map country name to regionId
                        const countryName = geo.properties.name;
                        let regionId;
                        
                        // Simple mapping for demonstration
                        if (countryName.includes("United States")) {
                          regionId = 1; // North America
                        } else if (countryName.includes("United Kingdom") || 
                                  countryName.includes("Germany") || 
                                  countryName.includes("France")) {
                          regionId = 2; // Europe
                        } else if (countryName.includes("China") || 
                                  countryName.includes("Japan") || 
                                  countryName.includes("India")) {
                          regionId = 3; // Asia
                        } else if (countryName.includes("Brazil") || 
                                  countryName.includes("Argentina")) {
                          regionId = 4; // South America
                        } else if (countryName.includes("South Africa") || 
                                  countryName.includes("Egypt") || 
                                  countryName.includes("Nigeria")) {
                          regionId = 5; // Africa
                        } else if (countryName.includes("Australia")) {
                          regionId = 6; // Oceania
                        }
                        
                        const resistanceData = regionId ? resistanceByRegion.get(regionId) : undefined;
                        
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={resistanceData ? colorScale(resistanceData.rate) : defaultFill}
                            stroke="#D6D6DA"
                            style={{
                              default: { outline: "none" },
                              hover: { outline: "none", fill: "#1976D2" },
                              pressed: { outline: "none" },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
              <div className="absolute top-0 right-0 p-2">
                <button
                  className="bg-white p-1 rounded shadow hover:bg-neutral-100 mb-1"
                  onClick={handleZoomIn}
                >
                  <i className="ri-zoom-in-line"></i>
                </button>
                <button
                  className="bg-white p-1 rounded shadow hover:bg-neutral-100"
                  onClick={handleZoomOut}
                >
                  <i className="ri-zoom-out-line"></i>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-1 text-sm">
                <span className="block w-4 h-4 bg-green-200 rounded"></span>
                <span className="block w-4 h-4 bg-yellow-200 rounded"></span>
                <span className="block w-4 h-4 bg-orange-300 rounded"></span>
                <span className="block w-4 h-4 bg-red-400 rounded"></span>
                <span className="block w-4 h-4 bg-red-600 rounded"></span>
                <span className="ml-2 text-xs text-neutral-600">Low to High Resistance</span>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                View Detailed Map
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GeographicMap;
