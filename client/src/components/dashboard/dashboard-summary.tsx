import { useQuery } from "@tanstack/react-query";
import { ResistanceSummary, FilterState } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardSummaryProps {
  filters: Partial<FilterState>;
}

const DashboardSummary = ({ filters }: DashboardSummaryProps) => {
  const { data, isLoading, error } = useQuery<ResistanceSummary>({
    queryKey: ['/api/dashboard/summary', filters],
  });

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-lg text-red-700">
        Error loading dashboard summary: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Samples Card */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-neutral-500 text-sm font-medium">Total Samples</h3>
          <div className="bg-primary-50 p-2 rounded-md">
            <i className="ri-test-tube-line text-primary-500"></i>
          </div>
        </div>
        <div className="mt-2">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-48" />
            </>
          ) : (
            <>
              <p className="text-2xl font-semibold">{data?.totalSamples.toLocaleString()}</p>
              <p className="text-xs text-success-500 flex items-center mt-1">
                <i className="ri-arrow-up-line mr-1"></i> 8.2% increase from previous period
              </p>
            </>
          )}
        </div>
      </div>
      
      {/* Resistant Isolates Card */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-neutral-500 text-sm font-medium">Resistant Isolates</h3>
          <div className="bg-red-50 p-2 rounded-md">
            <i className="ri-virus-line text-red-500"></i>
          </div>
        </div>
        <div className="mt-2">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-48" />
            </>
          ) : (
            <>
              <p className="text-2xl font-semibold">{data?.resistantIsolates.toLocaleString()}</p>
              <p className="text-xs text-red-500 flex items-center mt-1">
                <i className="ri-arrow-up-line mr-1"></i> 12.4% increase from previous period
              </p>
            </>
          )}
        </div>
      </div>
      
      {/* Resistance Rate Card */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-neutral-500 text-sm font-medium">Avg. Resistance Rate</h3>
          <div className="bg-amber-50 p-2 rounded-md">
            <i className="ri-percent-line text-amber-500"></i>
          </div>
        </div>
        <div className="mt-2">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-48" />
            </>
          ) : (
            <>
              <p className="text-2xl font-semibold">{data?.resistanceRate.toFixed(1)}%</p>
              <p className="text-xs text-amber-500 flex items-center mt-1">
                <i className="ri-arrow-up-line mr-1"></i> 2.1% increase from previous period
              </p>
            </>
          )}
        </div>
      </div>
      
      {/* Participating Facilities Card */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-neutral-500 text-sm font-medium">Participating Facilities</h3>
          <div className="bg-cyan-50 p-2 rounded-md">
            <i className="ri-hospital-line text-cyan-500"></i>
          </div>
        </div>
        <div className="mt-2">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-48" />
            </>
          ) : (
            <>
              <p className="text-2xl font-semibold">{data?.participatingFacilities}</p>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <i className="ri-arrow-up-line mr-1"></i> 15% increase from previous period
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
