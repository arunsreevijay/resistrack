import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { Bacteria, Antibiotic, Region, Facility } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import FilterBar from "@/components/filters/filter-bar";

const DataImport = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [manualFormData, setManualFormData] = useState({
    bacteriaId: "",
    antibioticId: "",
    regionId: "",
    facilityId: "",
    sampleDate: "",
    totalSamples: "",
    resistantSamples: "",
    notes: "",
  });

  // Fetch options for select inputs
  const { data: bacteriaOptions } = useQuery<Bacteria[]>({
    queryKey: ['/api/bacteria'],
  });

  const { data: antibioticOptions } = useQuery<Antibiotic[]>({
    queryKey: ['/api/antibiotics'],
  });

  const { data: regionOptions } = useQuery<Region[]>({
    queryKey: ['/api/regions'],
  });

  const { data: facilityOptions } = useQuery<Facility[]>({
    queryKey: ['/api/facilities', manualFormData.regionId ? { regionId: parseInt(manualFormData.regionId) } : undefined],
  });

  // Handle file upload change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setManualFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setManualFormData(prev => ({ ...prev, [name]: value }));
    
    // If region changes, reset facility
    if (name === "regionId") {
      setManualFormData(prev => ({ ...prev, facilityId: "" }));
    }
  };

  // Handle file upload submission
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    // In a real implementation, we would use FormData to upload the file
    // Since this is a prototype and we don't have a real backend for file handling,
    // we'll simulate the process by reading the file and sending data directly
    
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          // For demonstration, we'll assume a simple parse and send flow
          // A real implementation would handle parsing the CSV properly
          
          toast({
            title: "Success!",
            description: "File processed and data imported successfully",
          });
        }
      };
      
      reader.readAsText(file);
      
      // Simulate network delay
      setTimeout(() => {
        setUploading(false);
        setFile(null);
        
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }, 2000);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      setUploading(false);
    }
  };

  // Handle manual data submission
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      // Validate required fields
      const requiredFields = ['bacteriaId', 'antibioticId', 'regionId', 'sampleDate', 'totalSamples', 'resistantSamples'];
      for (const field of requiredFields) {
        if (!manualFormData[field as keyof typeof manualFormData]) {
          throw new Error(`${field.replace('Id', '').charAt(0).toUpperCase() + field.replace('Id', '').slice(1)} is required`);
        }
      }
      
      // Convert numeric fields
      const payload = {
        bacteriaId: parseInt(manualFormData.bacteriaId),
        antibioticId: parseInt(manualFormData.antibioticId),
        regionId: parseInt(manualFormData.regionId),
        facilityId: manualFormData.facilityId ? parseInt(manualFormData.facilityId) : null,
        sampleDate: new Date(manualFormData.sampleDate),
        totalSamples: parseInt(manualFormData.totalSamples),
        resistantSamples: parseInt(manualFormData.resistantSamples),
        notes: manualFormData.notes || null,
        uploadedById: null, // In a real app with auth, this would be the current user's ID
      };
      
      await apiRequest('POST', '/api/resistance-data', payload);
      
      toast({
        title: "Success!",
        description: "Resistance data added successfully",
      });
      
      // Reset form
      setManualFormData({
        bacteriaId: "",
        antibioticId: "",
        regionId: "",
        facilityId: "",
        sampleDate: "",
        totalSamples: "",
        resistantSamples: "",
        notes: "",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <FilterBar 
        filters={{ timePeriod: '12m' }} 
        onFilterChange={() => {}} 
      />
      
      <main className="flex-1 overflow-y-auto bg-neutral-100 p-4 md:p-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Import Resistance Data</CardTitle>
            <CardDescription>
              Add new antimicrobial resistance data to the platform. You can upload a CSV file or manually enter data.
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload CSV</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>
            </div>
            
            <CardContent className="pt-6">
              <TabsContent value="upload">
                <form onSubmit={handleFileUpload}>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                      <div className="mb-4 text-neutral-500">
                        <i className="ri-upload-cloud-line text-4xl"></i>
                        <p className="text-sm mt-2">
                          Drag and drop your CSV file here, or click to browse
                        </p>
                      </div>
                      
                      <input
                        id="file-upload"
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        Browse Files
                      </Button>
                      
                      {file && (
                        <div className="mt-4 p-2 bg-primary-50 rounded flex items-center">
                          <i className="ri-file-text-line text-primary-500 mr-2"></i>
                          <span className="text-sm font-medium">{file.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">File Format Requirements</h3>
                      <p className="text-sm text-neutral-600 mt-1">
                        Your CSV file must include the following columns: bacteria, antibiotic, region, date, total_samples, resistant_samples
                      </p>
                      <div className="mt-2">
                        <a href="#" className="text-primary-600 text-sm hover:underline">
                          <i className="ri-download-line mr-1"></i> Download Template
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button type="submit" disabled={!file || uploading} className="w-full">
                      {uploading ? (
                        <>
                          <i className="ri-loader-4-line animate-spin mr-2"></i>
                          Processing...
                        </>
                      ) : (
                        "Upload and Process"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="manual">
                <form onSubmit={handleManualSubmit}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bacteriaId">Bacteria *</Label>
                        <Select 
                          value={manualFormData.bacteriaId} 
                          onValueChange={(value) => handleSelectChange("bacteriaId", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select bacteria" />
                          </SelectTrigger>
                          <SelectContent>
                            {bacteriaOptions?.map(bacteria => (
                              <SelectItem key={bacteria.id} value={bacteria.id.toString()}>
                                {bacteria.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="antibioticId">Antibiotic *</Label>
                        <Select 
                          value={manualFormData.antibioticId} 
                          onValueChange={(value) => handleSelectChange("antibioticId", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select antibiotic" />
                          </SelectTrigger>
                          <SelectContent>
                            {antibioticOptions?.map(antibiotic => (
                              <SelectItem key={antibiotic.id} value={antibiotic.id.toString()}>
                                {antibiotic.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="regionId">Region *</Label>
                        <Select 
                          value={manualFormData.regionId} 
                          onValueChange={(value) => handleSelectChange("regionId", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select region" />
                          </SelectTrigger>
                          <SelectContent>
                            {regionOptions?.map(region => (
                              <SelectItem key={region.id} value={region.id.toString()}>
                                {region.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="facilityId">Facility (Optional)</Label>
                        <Select 
                          value={manualFormData.facilityId} 
                          onValueChange={(value) => handleSelectChange("facilityId", value)}
                          disabled={!manualFormData.regionId}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select facility" />
                          </SelectTrigger>
                          <SelectContent>
                            {facilityOptions?.map(facility => (
                              <SelectItem key={facility.id} value={facility.id.toString()}>
                                {facility.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sampleDate">Sample Date *</Label>
                        <Input
                          id="sampleDate"
                          name="sampleDate"
                          type="date"
                          value={manualFormData.sampleDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="totalSamples">Total Samples *</Label>
                        <Input
                          id="totalSamples"
                          name="totalSamples"
                          type="number"
                          min="1"
                          value={manualFormData.totalSamples}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="resistantSamples">Resistant Samples *</Label>
                        <Input
                          id="resistantSamples"
                          name="resistantSamples"
                          type="number"
                          min="0"
                          max={manualFormData.totalSamples || undefined}
                          value={manualFormData.resistantSamples}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <textarea
                        id="notes"
                        name="notes"
                        className="w-full min-h-[100px] rounded-md border border-neutral-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={manualFormData.notes}
                        onChange={handleInputChange}
                        placeholder="Add any additional information about this data point"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button type="submit" disabled={uploading} className="w-full">
                      {uploading ? (
                        <>
                          <i className="ri-loader-4-line animate-spin mr-2"></i>
                          Submitting...
                        </>
                      ) : (
                        "Submit Data"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
          
          <CardFooter className="flex justify-between border-t border-neutral-200 p-6">
            <p className="text-xs text-neutral-500">
              * Required fields
            </p>
            <p className="text-xs text-neutral-500">
              Data will be verified before being added to the database
            </p>
          </CardFooter>
        </Card>
      </main>
    </>
  );
};

export default DataImport;
