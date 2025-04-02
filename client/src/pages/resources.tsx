import { useQuery } from "@tanstack/react-query";
import { Resource } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: resources, isLoading, error } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
  });

  const filteredResources = resources?.filter(resource => 
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group resources by type
  const getResourcesByType = (type: string) => {
    return filteredResources?.filter(resource => 
      resource.type.toLowerCase() === type.toLowerCase()
    ) || [];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  const ResourceCard = ({ resource }: { resource: Resource }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex h-full">
        <div className={`${getResourceIconBackground(resource.type)} px-6 py-8 flex items-center justify-center`}>
          <div className="text-2xl">
            {getResourceIcon(resource.type)}
          </div>
        </div>
        <div className="p-4 flex-1">
          <h3 className="font-medium text-neutral-800">{resource.title}</h3>
          {resource.description && (
            <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{resource.description}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-neutral-500">
              {formatDate(resource.publishedAt)}
            </span>
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View Resource <i className="ri-external-link-line text-xs ml-1"></i>
            </a>
          </div>
        </div>
      </div>
    </Card>
  );

  const ResourceList = ({ resources }: { resources: Resource[] }) => (
    <>
      {resources.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {resources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-neutral-500">No resources found</p>
        </div>
      )}
    </>
  );

  if (error) {
    return (
      <main className="flex-1 overflow-y-auto bg-neutral-100 p-4 md:p-6">
        <div className="bg-red-100 p-4 rounded-lg text-red-700">
          Error loading resources: {(error as Error).message}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto bg-neutral-100 p-4 md:p-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Resource Library</CardTitle>
              <CardDescription>
                Educational materials and research about antimicrobial resistance
              </CardDescription>
            </div>
            <div className="w-full md:w-64">
              <Input
                type="search"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardHeader>
        
        <Tabs defaultValue="all">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="webinars">Webinars</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  {[1, 2, 3, 4].map(i => (
                    <Card key={i}>
                      <div className="flex h-full">
                        <Skeleton className="w-16 h-32" />
                        <div className="p-4 flex-1">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-2/3 mb-4" />
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <TabsContent value="all">
                  <ResourceList resources={filteredResources || []} />
                </TabsContent>
                
                <TabsContent value="documents">
                  <ResourceList resources={getResourcesByType('document')} />
                </TabsContent>
                
                <TabsContent value="webinars">
                  <ResourceList resources={getResourcesByType('webinar')} />
                </TabsContent>
                
                <TabsContent value="guides">
                  <ResourceList resources={getResourcesByType('guide')} />
                </TabsContent>
                
                <TabsContent value="research">
                  <ResourceList resources={getResourcesByType('research')} />
                </TabsContent>
              </>
            )}
          </CardContent>
        </Tabs>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Request a Resource</CardTitle>
          <CardDescription>
            Can't find what you're looking for? Request additional resources or suggest new content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-primary-50 p-6 rounded-lg border border-primary-100">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <i className="ri-question-line text-xl text-primary-600"></i>
                </div>
                <h3 className="text-lg font-medium text-primary-800 mb-2">Request Information</h3>
                <p className="text-sm text-primary-700 mb-4">
                  Need specific guidance or resources on antimicrobial resistance?
                </p>
                <Button>
                  Request Information
                </Button>
              </div>
            </div>
            
            <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                  <i className="ri-chat-3-line text-xl text-neutral-600"></i>
                </div>
                <h3 className="text-lg font-medium text-neutral-800 mb-2">Suggest Content</h3>
                <p className="text-sm text-neutral-700 mb-4">
                  Have a resource to share with the antimicrobial resistance community?
                </p>
                <Button variant="outline">
                  Suggest Content
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Resources;
