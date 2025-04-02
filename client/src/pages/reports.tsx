import { useState } from "react";
import { FilterState } from "@shared/schema";
import FilterBar from "@/components/filters/filter-bar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<Partial<FilterState>>({
    timePeriod: '12m',
  });
  const [generating, setGenerating] = useState(false);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(newFilters);
  };

  const handleGenerateReport = (reportType: string) => {
    setGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setGenerating(false);
      toast({
        title: "Report Generated",
        description: `Your ${reportType} report has been generated successfully.`,
      });
    }, 2000);
  };

  return (
    <>
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      
      <main className="flex-1 overflow-y-auto bg-neutral-100 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Reports & Data Export</CardTitle>
            <CardDescription>
              Generate reports and export data for analysis or compliance purposes. Use the filters above to refine the data included in your reports.
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="standard">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="standard">Standard Reports</TabsTrigger>
                <TabsTrigger value="regulatory">Regulatory Reports</TabsTrigger>
                <TabsTrigger value="custom">Custom Reports</TabsTrigger>
              </TabsList>
            </div>
            
            <CardContent className="pt-6">
              <TabsContent value="standard">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Resistance Summary Report */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Resistance Summary</CardTitle>
                      <CardDescription>Overview of resistance patterns with trend analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
                        <li>Summary statistics by bacteria and antibiotic</li>
                        <li>Regional comparison data</li>
                        <li>12-month trend analysis</li>
                        <li>Top resistance concerns</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleGenerateReport("Resistance Summary")}
                        disabled={generating}
                        className="w-full"
                      >
                        {generating ? (
                          <>
                            <i className="ri-loader-4-line animate-spin mr-2"></i>
                            Generating...
                          </>
                        ) : (
                          <>
                            <i className="ri-file-pdf-line mr-2"></i>
                            Generate PDF
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Antibiotic Effectiveness Report */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Antibiotic Effectiveness</CardTitle>
                      <CardDescription>Detailed analysis of antibiotic efficacy</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
                        <li>Effectiveness rankings by antibiotic</li>
                        <li>Bacteria-specific resistance patterns</li>
                        <li>Regional variation in effectiveness</li>
                        <li>Historical effectiveness trends</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleGenerateReport("Antibiotic Effectiveness")}
                        disabled={generating}
                        className="w-full"
                      >
                        {generating ? (
                          <>
                            <i className="ri-loader-4-line animate-spin mr-2"></i>
                            Generating...
                          </>
                        ) : (
                          <>
                            <i className="ri-file-excel-line mr-2"></i>
                            Export Excel
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Geographic Distribution Report */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Geographic Distribution</CardTitle>
                      <CardDescription>Spatial analysis of resistance patterns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
                        <li>Regional hotspot identification</li>
                        <li>Facility-level comparison</li>
                        <li>Geographic spread analysis</li>
                        <li>Interactive maps and heatmaps</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleGenerateReport("Geographic Distribution")}
                        disabled={generating}
                        className="w-full"
                      >
                        {generating ? (
                          <>
                            <i className="ri-loader-4-line animate-spin mr-2"></i>
                            Generating...
                          </>
                        ) : (
                          <>
                            <i className="ri-map-pin-line mr-2"></i>
                            Generate Map
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="regulatory">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* CDC Report */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">CDC Compliance Report</CardTitle>
                      <CardDescription>Centers for Disease Control reporting format</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
                        <li>Standard CDC reporting format</li>
                        <li>Multi-drug resistance statistics</li>
                        <li>Emerging threat identification</li>
                        <li>Standardized antimicrobial categories</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleGenerateReport("CDC Compliance")}
                        disabled={generating}
                        className="w-full"
                      >
                        {generating ? (
                          <>
                            <i className="ri-loader-4-line animate-spin mr-2"></i>
                            Generating...
                          </>
                        ) : (
                          <>
                            <i className="ri-file-chart-line mr-2"></i>
                            Generate Report
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* WHO Report */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">WHO GLASS Report</CardTitle>
                      <CardDescription>Global Antimicrobial Resistance Surveillance System</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
                        <li>WHO GLASS compliant format</li>
                        <li>Standardized international metrics</li>
                        <li>Population-based analysis</li>
                        <li>Priority pathogen focus</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleGenerateReport("WHO GLASS")}
                        disabled={generating}
                        className="w-full"
                      >
                        {generating ? (
                          <>
                            <i className="ri-loader-4-line animate-spin mr-2"></i>
                            Generating...
                          </>
                        ) : (
                          <>
                            <i className="ri-global-line mr-2"></i>
                            Generate Report
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Joint Commission Report */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Joint Commission Report</CardTitle>
                      <CardDescription>Antibiotic stewardship compliance report</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 text-sm text-neutral-600 space-y-1">
                        <li>Antimicrobial stewardship metrics</li>
                        <li>Intervention effectiveness stats</li>
                        <li>Prescribing pattern analysis</li>
                        <li>Accreditation-ready format</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleGenerateReport("Joint Commission")}
                        disabled={generating}
                        className="w-full"
                      >
                        {generating ? (
                          <>
                            <i className="ri-loader-4-line animate-spin mr-2"></i>
                            Generating...
                          </>
                        ) : (
                          <>
                            <i className="ri-file-list-3-line mr-2"></i>
                            Generate Report
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="custom">
                <div className="space-y-6">
                  <div className="bg-primary-50 p-4 rounded-md border border-primary-200">
                    <div className="flex items-start">
                      <i className="ri-information-line text-primary-500 text-lg mt-0.5 mr-2"></i>
                      <div>
                        <h3 className="font-medium text-primary-800">Custom Report Builder</h3>
                        <p className="text-sm text-primary-700 mt-1">
                          Create tailored reports by selecting specific metrics, time periods, and visualization types.
                          Custom reports can be saved as templates for future use.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-50 border border-neutral-200 rounded-md p-6">
                    <div className="text-center">
                      <i className="ri-tools-line text-4xl text-neutral-400 mb-3"></i>
                      <h3 className="text-lg font-medium text-neutral-800">Custom Report Builder</h3>
                      <p className="text-sm text-neutral-600 mt-2 max-w-md mx-auto">
                        The custom report builder allows you to create tailored reports with exactly the data and visualizations you need.
                      </p>
                      <Button className="mt-4">
                        <i className="ri-add-line mr-2"></i>
                        Create New Report
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border border-neutral-200 rounded-md divide-y">
                    <h3 className="p-4 font-medium">Saved Report Templates</h3>
                    
                    <div className="p-4 text-center text-neutral-500">
                      <p>You haven't created any custom report templates yet.</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
          
          <CardFooter className="justify-between border-t border-neutral-200 p-6">
            <div className="text-sm text-neutral-500">
              <i className="ri-time-line mr-1"></i> Reports reflect data based on applied filters
            </div>
            <Button variant="outline">
              <i className="ri-settings-line mr-2"></i>
              Report Settings
            </Button>
          </CardFooter>
        </Card>
      </main>
    </>
  );
};

export default Reports;
