import { useQuery } from "@tanstack/react-query";
import { AntibioticEffectiveness, FilterState } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AntibioticEffectivenessWidgetProps {
  filters: Partial<FilterState>;
}

const AntibioticEffectivenessWidget = ({ filters }: AntibioticEffectivenessWidgetProps) => {
  const { data, isLoading, error } = useQuery<AntibioticEffectiveness[]>({
    queryKey: ['/api/dashboard/effectiveness', filters],
  });

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 80) return "bg-green-500";
    if (effectiveness >= 65) return "bg-amber-500";
    return "bg-red-500";
  };

  const getEffectivenessTextColor = (effectiveness: number) => {
    if (effectiveness >= 80) return "text-green-500";
    if (effectiveness >= 65) return "text-amber-500";
    return "text-red-500";
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Antibiotic Effectiveness</CardTitle>
          <CardDescription>Current sensitivity data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-100 p-4 rounded-lg text-red-700">
            Error loading antibiotic effectiveness: {(error as Error).message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Antibiotic Effectiveness</CardTitle>
        <CardDescription>Current sensitivity data</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="space-y-3">
            {data && data.length > 0 ? (
              data.map((antibiotic) => (
                <div key={antibiotic.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{antibiotic.name}</p>
                    <p className="text-xs text-neutral-500">
                      {antibiotic.regions.length > 1 
                        ? "All regions" 
                        : antibiotic.regions[0]}
                    </p>
                  </div>
                  <div className="w-32">
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getEffectivenessColor(antibiotic.effectiveness)} rounded-full`} 
                        style={{ width: `${antibiotic.effectiveness}%` }}
                      ></div>
                    </div>
                    <p className={`text-xs text-right mt-1 ${getEffectivenessTextColor(antibiotic.effectiveness)}`}>
                      {antibiotic.effectiveness.toFixed(0)}% effective
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <p>No effectiveness data available</p>
              </div>
            )}
            
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                View Detailed Report
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AntibioticEffectivenessWidget;
