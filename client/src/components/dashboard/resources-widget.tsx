import { useQuery } from "@tanstack/react-query";
import { Resource } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

const ResourcesWidget = () => {
  const { data, isLoading, error } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
  });

  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'document':
        return <i className="ri-file-paper-2-line text-primary-500"></i>;
      case 'webinar':
        return <i className="ri-vidicon-line text-cyan-500"></i>;
      case 'guide':
        return <i className="ri-book-open-line text-amber-500"></i>;
      case 'research':
        return <i className="ri-flask-line text-purple-500"></i>;
      default:
        return <i className="ri-article-line text-neutral-500"></i>;
    }
  };

  const getResourceIconBackground = (type: string) => {
    switch (type.toLowerCase()) {
      case 'document':
        return 'bg-primary-100';
      case 'webinar':
        return 'bg-cyan-100';
      case 'guide':
        return 'bg-amber-100';
      case 'research':
        return 'bg-purple-100';
      default:
        return 'bg-neutral-100';
    }
  };

  // Format the resource date appropriately
  const formatResourceDate = (date: Date) => {
    const now = new Date();
    const resourceDate = new Date(date);
    
    // Check if it's a future date
    if (resourceDate > now) {
      return `Live on ${resourceDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
    }
    
    // Check if it's within the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    if (resourceDate > oneWeekAgo) {
      const days = Math.floor((now.getTime() - resourceDate.getTime()) / (1000 * 60 * 60 * 24));
      return days === 0 
        ? "Today" 
        : days === 1 
          ? "Yesterday" 
          : `${days} days ago`;
    }
    
    // Check if it's within the last month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    if (resourceDate > oneMonthAgo) {
      const weeks = Math.floor((now.getTime() - resourceDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
    
    // Otherwise, just show "Updated X months ago"
    const months = (now.getMonth() - resourceDate.getMonth()) + 
      (12 * (now.getFullYear() - resourceDate.getFullYear()));
    
    return `Updated ${months} ${months === 1 ? 'month' : 'months'} ago`;
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest Resources</CardTitle>
          <CardDescription>Educational materials & research</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-100 p-4 rounded-lg text-red-700">
            Error loading resources: {(error as Error).message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Resources</CardTitle>
        <CardDescription>Educational materials & research</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {data && data.length > 0 ? (
              data.slice(0, 3).map((resource) => (
                <li key={resource.id} className="py-3 first:pt-0 last:pb-0">
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block hover:bg-neutral-50 -m-2 p-2 rounded-md"
                  >
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 ${getResourceIconBackground(resource.type)} p-2 rounded`}>
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-neutral-800">{resource.title}</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {formatResourceDate(resource.publishedAt)}
                        </p>
                      </div>
                    </div>
                  </a>
                </li>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <p>No resources available</p>
              </div>
            )}
          </ul>
        )}
        
        <div className="mt-4 text-center">
          <Link href="/resources" className="text-sm text-primary-600 hover:text-primary-800 font-medium">
            Browse Resource Library
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourcesWidget;
