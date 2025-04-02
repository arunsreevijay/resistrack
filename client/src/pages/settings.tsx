import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  // Profile settings state
  const [profileData, setProfileData] = useState({
    fullName: "Dr. Jane Doe",
    email: "jane.doe@example.com",
    organization: "Central Hospital",
    position: "Infectious Disease Specialist",
    phone: "+1 (555) 123-4567"
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    criticalResistanceAlerts: true,
    weeklyReports: true,
    researchUpdates: false,
    systemAnnouncements: true
  });

  // Display settings state
  const [displaySettings, setDisplaySettings] = useState({
    theme: "light",
    dashboardLayout: "standard",
    defaultView: "dashboard",
    dataDisplayUnits: "percentage",
    tableRowsPerPage: "20"
  });

  // Data settings state
  const [dataSettings, setDataSettings] = useState({
    defaultTimePeriod: "12m",
    dataRefreshRate: "hourly",
    includeZeroSamples: false,
    autoExportData: false,
    exportFormat: "csv"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: string) => {
    const { name, value } = e.target;
    
    if (section === 'profile') {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (checked: boolean, name: string) => {
    setNotificationSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSelectChange = (value: string, name: string, section: string) => {
    if (section === 'display') {
      setDisplaySettings(prev => ({ ...prev, [name]: value }));
    } else if (section === 'data') {
      setDataSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveSettings = (section: string) => {
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings saved",
        description: `Your ${section} settings have been updated successfully.`,
      });
    }, 1000);
  };

  return (
    <main className="flex-1 overflow-y-auto bg-neutral-100 p-4 md:p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="profile">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="pt-6">
            {/* Profile Settings */}
            <TabsContent value="profile">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 text-xl font-medium">
                    JD
                  </div>
                  <div>
                    <h3 className="font-medium">{profileData.fullName}</h3>
                    <p className="text-sm text-neutral-500">{profileData.organization}</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <i className="ri-camera-line mr-1"></i> Change Photo
                    </Button>
                  </div>
                </div>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={(e) => handleInputChange(e, 'profile')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange(e, 'profile')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        name="organization"
                        value={profileData.organization}
                        onChange={(e) => handleInputChange(e, 'profile')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        name="position"
                        value={profileData.position}
                        onChange={(e) => handleInputChange(e, 'profile')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange(e, 'profile')}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleSaveSettings('profile')}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Notification Settings */}
            <TabsContent value="notifications">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailAlerts">Email Alerts</Label>
                        <p className="text-sm text-neutral-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="emailAlerts"
                        checked={notificationSettings.emailAlerts}
                        onCheckedChange={(checked) => handleSwitchChange(checked, 'emailAlerts')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="criticalResistanceAlerts">Critical Resistance Alerts</Label>
                        <p className="text-sm text-neutral-500">Be notified of significant resistance pattern changes</p>
                      </div>
                      <Switch
                        id="criticalResistanceAlerts"
                        checked={notificationSettings.criticalResistanceAlerts}
                        onCheckedChange={(checked) => handleSwitchChange(checked, 'criticalResistanceAlerts')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weeklyReports">Weekly Summary Reports</Label>
                        <p className="text-sm text-neutral-500">Receive weekly summary of resistance trends</p>
                      </div>
                      <Switch
                        id="weeklyReports"
                        checked={notificationSettings.weeklyReports}
                        onCheckedChange={(checked) => handleSwitchChange(checked, 'weeklyReports')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="researchUpdates">Research Updates</Label>
                        <p className="text-sm text-neutral-500">Get updates on new antimicrobial resistance research</p>
                      </div>
                      <Switch
                        id="researchUpdates"
                        checked={notificationSettings.researchUpdates}
                        onCheckedChange={(checked) => handleSwitchChange(checked, 'researchUpdates')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="systemAnnouncements">System Announcements</Label>
                        <p className="text-sm text-neutral-500">Be informed about platform updates and maintenance</p>
                      </div>
                      <Switch
                        id="systemAnnouncements"
                        checked={notificationSettings.systemAnnouncements}
                        onCheckedChange={(checked) => handleSwitchChange(checked, 'systemAnnouncements')}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleSaveSettings('notification')}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Display Settings */}
            <TabsContent value="display">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select 
                      value={displaySettings.theme} 
                      onValueChange={(value) => handleSelectChange(value, 'theme', 'display')}
                    >
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dashboardLayout">Dashboard Layout</Label>
                    <Select 
                      value={displaySettings.dashboardLayout} 
                      onValueChange={(value) => handleSelectChange(value, 'dashboardLayout', 'display')}
                    >
                      <SelectTrigger id="dashboardLayout">
                        <SelectValue placeholder="Select layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="expanded">Expanded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="defaultView">Default View</Label>
                    <Select 
                      value={displaySettings.defaultView} 
                      onValueChange={(value) => handleSelectChange(value, 'defaultView', 'display')}
                    >
                      <SelectTrigger id="defaultView">
                        <SelectValue placeholder="Select default view" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dashboard">Dashboard</SelectItem>
                        <SelectItem value="map">Geographic Map</SelectItem>
                        <SelectItem value="analysis">Analysis Tools</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dataDisplayUnits">Data Display Units</Label>
                    <Select 
                      value={displaySettings.dataDisplayUnits} 
                      onValueChange={(value) => handleSelectChange(value, 'dataDisplayUnits', 'display')}
                    >
                      <SelectTrigger id="dataDisplayUnits">
                        <SelectValue placeholder="Select units" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="ratio">Ratio</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tableRowsPerPage">Table Rows Per Page</Label>
                    <Select 
                      value={displaySettings.tableRowsPerPage} 
                      onValueChange={(value) => handleSelectChange(value, 'tableRowsPerPage', 'display')}
                    >
                      <SelectTrigger id="tableRowsPerPage">
                        <SelectValue placeholder="Select rows per page" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleSaveSettings('display')}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Data Settings */}
            <TabsContent value="data">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultTimePeriod">Default Time Period</Label>
                    <Select 
                      value={dataSettings.defaultTimePeriod} 
                      onValueChange={(value) => handleSelectChange(value, 'defaultTimePeriod', 'data')}
                    >
                      <SelectTrigger id="defaultTimePeriod">
                        <SelectValue placeholder="Select default time period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3m">Last 3 Months</SelectItem>
                        <SelectItem value="6m">Last 6 Months</SelectItem>
                        <SelectItem value="12m">Last 12 Months</SelectItem>
                        <SelectItem value="2y">Last 2 Years</SelectItem>
                        <SelectItem value="5y">Last 5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dataRefreshRate">Data Refresh Rate</Label>
                    <Select 
                      value={dataSettings.dataRefreshRate} 
                      onValueChange={(value) => handleSelectChange(value, 'dataRefreshRate', 'data')}
                    >
                      <SelectTrigger id="dataRefreshRate">
                        <SelectValue placeholder="Select refresh rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual Only</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="realtime">Real-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="includeZeroSamples">Include Zero Samples</Label>
                      <p className="text-sm text-neutral-500">Include records where sample count is zero</p>
                    </div>
                    <Switch
                      id="includeZeroSamples"
                      checked={dataSettings.includeZeroSamples}
                      onCheckedChange={(checked) => 
                        setDataSettings(prev => ({ ...prev, includeZeroSamples: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoExportData">Auto-Export Data</Label>
                      <p className="text-sm text-neutral-500">Automatically export data reports on schedule</p>
                    </div>
                    <Switch
                      id="autoExportData"
                      checked={dataSettings.autoExportData}
                      onCheckedChange={(checked) => 
                        setDataSettings(prev => ({ ...prev, autoExportData: checked }))
                      }
                    />
                  </div>
                  
                  {dataSettings.autoExportData && (
                    <div className="ml-6 border-l-2 border-neutral-200 pl-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="exportFormat">Export Format</Label>
                        <Select 
                          value={dataSettings.exportFormat} 
                          onValueChange={(value) => handleSelectChange(value, 'exportFormat', 'data')}
                        >
                          <SelectTrigger id="exportFormat">
                            <SelectValue placeholder="Select export format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t border-neutral-200">
                  <h3 className="font-medium mb-2">Data Management</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-neutral-50">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <i className="ri-download-cloud-line text-xl text-neutral-700 mt-0.5 mr-3"></i>
                          <div>
                            <h4 className="font-medium text-neutral-800">Export All Data</h4>
                            <p className="text-sm text-neutral-600 mt-1">
                              Download all your resistance data as a backup
                            </p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Export Data
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-red-50">
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <i className="ri-delete-bin-line text-xl text-red-700 mt-0.5 mr-3"></i>
                          <div>
                            <h4 className="font-medium text-red-800">Delete Account Data</h4>
                            <p className="text-sm text-red-700 mt-1">
                              Permanently remove all your data from the system
                            </p>
                            <Button variant="destructive" size="sm" className="mt-2">
                              Delete Data
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={() => handleSaveSettings('data')}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <CardFooter className="flex justify-between border-t border-neutral-200 p-6">
          <div className="text-xs text-neutral-500">
            Last updated: {new Date().toLocaleString()}
          </div>
          <div className="flex space-x-4">
            <Button variant="outline">Cancel</Button>
            <Button 
              onClick={() => handleSaveSettings('all')}
              disabled={saving}
            >
              {saving ? (
                <>
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Saving All...
                </>
              ) : (
                'Save All Changes'
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Settings;
