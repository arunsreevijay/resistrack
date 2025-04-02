import { useQuery } from "@tanstack/react-query";
import { Alert } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const AlertsWidget = () => {
  const { data, isLoading, error } = useQuery<Alert[]>({
    queryKey: ['/api/alerts', { active: true }],
  });

  const renderAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <i className="ri-alarm-warning-line text-red-500"></i>;
      case 'warning':
        return <i className="ri-error-warning-line text-amber-500"></i>;
      case 'info':
      default:
        return <i className="ri-information-line text-primary-500"></i>;
    }
  };

  const getAlertStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-l-4 border-red-500 rounded-r-md';
      case 'warning':
        return 'bg-amber-50 border-l-4 border-amber-500 rounded-r-md';
      case 'info':
      default:
        return 'bg-primary-50 border-l-4 border-primary-500 rounded-r-md';
    }
  };

  const getAlertTextStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          title: 'text-red-800',
          description: 'text-red-700',
          time: 'text-red-600'
        };
      case 'warning':
        return {
          title: 'text-amber-800',
          description: 'text-amber-700',
          time: 'text-amber-600'
        };
      case 'info':
      default:
        return {
          title: 'text-primary-800',
          description: 'text-primary-700',
          time: 'text-primary-600'
        };
    }
  };

  // Format relative time (e.g., "2 hours ago", "Yesterday", etc.)
  const formatRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const timeDiff = now.getTime() - new Date(timestamp).getTime();
    
    // Convert to minutes
    const minutes = Math.floor(timeDiff / (1000 * 60));
    
    if (minutes < 60) {
      return minutes <= 1 ? "just now" : `${minutes} minutes ago`;
    }
    
    // Convert to hours
    const hours = Math.floor(minutes / 60);
    
    if (hours < 24) {
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    }
    
    // Convert to days
    const days = Math.floor(hours / 24);
    
    if (days === 1) {
      return "Yesterday";
    }
    
    if (days < 7) {
      return `${days} days ago`;
    }
    
    // Return formatted date for older timestamps
    return new Date(timestamp).toLocaleDateString();
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Significant resistance pattern changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-100 p-4 rounded-lg text-red-700">
            Error loading alerts: {(error as Error).message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
        <CardDescription>Significant resistance pattern changes</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {data && data.length > 0 ? (
              data.slice(0, 3).map((alert) => {
                const textStyles = getAlertTextStyles(alert.severity);
                
                return (
                  <div 
                    key={alert.id} 
                    className={`p-3 ${getAlertStyles(alert.severity)}`}
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {renderAlertIcon(alert.severity)}
                      </div>
                      <div className="ml-3">
                        <h3 className={`text-sm font-medium ${textStyles.title}`}>
                          {alert.title}
                        </h3>
                        <div className={`mt-1 text-xs ${textStyles.description}`}>
                          <p>{alert.description}</p>
                          <p className={`mt-1 ${textStyles.time}`}>
                            {formatRelativeTime(alert.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <i className="ri-check-double-line text-2xl mb-2"></i>
                <p>No active alerts at this time</p>
              </div>
            )}
            
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-primary-600 hover:text-primary-800 font-medium">
                View All Alerts
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsWidget;
