import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import brain from "brain";
import { toast } from "sonner";
import { Button } from "components/Button";
import { CyberShield } from "components/CyberShield";
import { Layout } from "components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "components/Card";
import { ScanResultIndicator } from "components/ScanResultIndicator";
import { format } from "date-fns";

type ScanHistoryItem = {
  is_scam: boolean;
  threat_level: string;
  confidence_score: number;
  content_type: string;
  content: string;
  timestamp: string;
  scan_id: string;
};

export default function History() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  
  // Filter states
  const [threatFilter, setThreatFilter] = useState<string>("all");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("all");
  
  useEffect(() => {
    loadScanHistory();
  }, []);
  
  const loadScanHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await brain.get_scan_history({ limit: 50 });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setScanHistory(data);
    } catch (error) {
      console.error("Error loading scan history:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      toast.error("Failed to load scan history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const viewScanDetails = async (scanId: string) => {
    if (selectedScanId === scanId) {
      setSelectedScanId(null);
      return;
    }
    
    setSelectedScanId(scanId);
  };
  
  // Get filtered history
  const filteredHistory = scanHistory.filter(scan => {
    if (threatFilter !== "all" && scan.threat_level !== threatFilter) {
      return false;
    }
    
    if (contentTypeFilter !== "all" && scan.content_type !== contentTypeFilter) {
      return false;
    }
    
    return true;
  });
  
  // Helper to truncate content text
  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };
  
  // Get appropriate color based on threat level
  const getThreatColor = (threatLevel: string) => {
    switch (threatLevel) {
      case "dangerous":
        return "text-red-500";
      case "suspicious":
        return "text-yellow-500";
      case "safe":
      default:
        return "text-green-500";
    }
  };
  
  // Get appropriate background color based on threat level
  const getThreatBgColor = (threatLevel: string) => {
    switch (threatLevel) {
      case "dangerous":
        return "border-red-500/20 bg-red-500/5";
      case "suspicious":
        return "border-yellow-500/20 bg-yellow-500/5";
      case "safe":
      default:
        return "border-green-500/20 bg-green-500/5";
    }
  };
  
  // Get icon for content type
  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case "url":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case "email":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "phone":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case "image_text":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        );
    }
  };
  
  // Format timestamp
  const formatDate = (isoDate: string) => {
    try {
      return format(new Date(isoDate), "MMM d, yyyy h:mm a");
    } catch (e) {
      return "Unknown Date";
    }
  };
  
  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-metal-dark overflow-hidden relative">
        {/* Background metal shine elements */}
        <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-metal-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-metal-chrome/10 rounded-full blur-3xl"></div>
        
        {/* Header */}
        <header className="relative z-10 border-b border-metal-accent/30 py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CyberShield className="w-10 h-10" glowing />
              <h1 className="text-2xl font-bold tracking-tight text-metal-chrome">Legit</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-foreground hover:text-metal-chrome transition-colors">Home</a>
              <a href="/dashboard" className="text-foreground hover:text-metal-chrome transition-colors">Dashboard</a>
              <a href="/history" className="text-metal-chrome font-medium border-b-2 border-metal-chrome">History</a>
              <a href="#" className="text-foreground hover:text-metal-chrome transition-colors">Resources</a>
            </nav>
            <Button variant="cyber-outline" size="sm" className="border-metal-chrome text-metal-chrome">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex flex-col max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Scan <span className="text-metal-chrome">History</span></h2>
              <p className="text-muted-foreground">Review your previous scans and scan results.</p>
            </div>
            
            {/* Filters section */}
            <Card className="bg-metal-shadow/80 backdrop-blur-sm border-metal-accent/30 overflow-hidden relative mb-6">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-metal-chrome to-metal-highlight"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-metal-chrome" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Threat Level</label>
                    <select 
                      value={threatFilter}
                      onChange={(e) => setThreatFilter(e.target.value)}
                      className="w-full p-2 bg-background/50 border border-metal-accent/30 rounded-md focus:outline-none focus:border-metal-chrome transition-all"
                    >
                      <option value="all">All Threat Levels</option>
                      <option value="safe">Safe</option>
                      <option value="suspicious">Suspicious</option>
                      <option value="dangerous">Dangerous</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Content Type</label>
                    <select 
                      value={contentTypeFilter}
                      onChange={(e) => setContentTypeFilter(e.target.value)}
                      className="w-full p-2 bg-background/50 border border-metal-accent/30 rounded-md focus:outline-none focus:border-metal-chrome transition-all"
                    >
                      <option value="all">All Content Types</option>
                      <option value="text">Text</option>
                      <option value="url">URL</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone Number</option>
                      <option value="image_text">Image Text</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* History list section */}
            <Card className="bg-metal-shadow/80 backdrop-blur-sm border-metal-accent/30 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-metal-chrome to-metal-highlight"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-metal-chrome" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Scan History
                  </CardTitle>
                  <Button 
                    variant="cyber-outline" 
                    size="sm" 
                    className="border-metal-chrome text-metal-chrome"
                    onClick={loadScanHistory}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center p-12">
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-metal-chrome animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-metal-chrome">Loading scan history...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium mb-2">Failed to load scan history</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button 
                      variant="cyber" 
                      className="mx-auto" 
                      onClick={loadScanHistory}
                    >
                      Try Again
                    </Button>
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="text-center p-8 border border-metal-accent/20 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-metal-chrome/60 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    {scanHistory.length === 0 ? (
                      <>
                        <h3 className="text-lg font-medium mb-2">No scan history found</h3>
                        <p className="text-muted-foreground mb-4">You haven't performed any scans yet. Go to the Dashboard to scan content.</p>
                        <Button 
                          variant="cyber" 
                          className="mx-auto" 
                          onClick={() => navigate("/dashboard")}
                        >
                          Go to Dashboard
                        </Button>
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-medium mb-2">No matching scans</h3>
                        <p className="text-muted-foreground mb-4">No scans match your current filter criteria.</p>
                        <Button 
                          variant="cyber-outline" 
                          className="mx-auto" 
                          onClick={() => {
                            setThreatFilter("all");
                            setContentTypeFilter("all");
                          }}
                        >
                          Clear Filters
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredHistory.map(scan => (
                      <div 
                        key={scan.scan_id} 
                        className={`border ${scan.scan_id === selectedScanId ? getThreatBgColor(scan.threat_level) : 'border-metal-accent/20'} rounded-md overflow-hidden transition-colors duration-150`}
                      >
                        <div 
                          className="p-4 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                          onClick={() => viewScanDetails(scan.scan_id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                              <ScanResultIndicator status={scan.threat_level as "safe" | "suspicious" | "dangerous"} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`font-medium ${getThreatColor(scan.threat_level)}`}>
                                  {scan.threat_level.charAt(0).toUpperCase() + scan.threat_level.slice(1)}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-metal-accent/20 flex items-center gap-1">
                                  {getContentTypeIcon(scan.content_type)}
                                  {scan.content_type.charAt(0).toUpperCase() + scan.content_type.slice(1).replace('_', ' ')}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {truncateText(scan.content)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0 text-right sm:text-left w-full sm:w-auto">
                            <div className="text-xs text-muted-foreground">
                              {formatDate(scan.timestamp)}
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-metal-chrome/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* Expanded details */}
                        {scan.scan_id === selectedScanId && (
                          <div className="border-t border-metal-accent/20 p-4 bg-metal-accent/5">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground mb-2">CONTENT ANALYZED</h4>
                                  <div className="bg-background/50 border border-metal-accent/20 rounded-md p-3 break-words">
                                    {scan.content}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground mb-2">CONFIDENCE SCORE</h4>
                                  <div className="bg-background/50 border border-metal-accent/20 rounded-md p-3">
                                    <div className="flex items-center">
                                      <div className="w-full h-3 bg-background rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full bg-gradient-to-r from-${scan.threat_level === 'dangerous' ? 'red' : scan.threat_level === 'suspicious' ? 'yellow' : 'green'}-500 to-${scan.threat_level === 'dangerous' ? 'red' : scan.threat_level === 'suspicious' ? 'yellow' : 'green'}-600`}
                                          style={{ width: `${Math.round(scan.confidence_score * 100)}%` }}
                                        ></div>
                                      </div>
                                      <span className={`ml-3 font-medium ${getThreatColor(scan.threat_level)}`}>
                                        {Math.round(scan.confidence_score * 100)}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground mb-2">ANALYSIS</h4>
                                  <div className="bg-background/50 border border-metal-accent/20 rounded-md p-3">
                                    <p>{scan.analysis || "No detailed analysis available."}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium text-muted-foreground mb-2">RECOMMENDATIONS</h4>
                                  <div className="bg-background/50 border border-metal-accent/20 rounded-md p-3">
                                    {scan.recommendations && scan.recommendations.length > 0 ? (
                                      <ul className="list-disc list-inside space-y-1 text-sm">
                                        {scan.recommendations.map((rec, index) => (
                                          <li key={index}>{rec}</li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-muted-foreground">No specific recommendations available.</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-end">
                              <Button 
                                variant="cyber-outline" 
                                size="sm" 
                                className="border-metal-chrome text-metal-chrome"
                                onClick={() => navigate(`/dashboard?scan=${scan.scan_id}`)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Scan Similar Content
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-metal-accent/30 py-4 mt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-2 md:mb-0">
                <CyberShield className="w-6 h-6" />
                <span className="text-sm font-semibold">Legit</span>
              </div>
              <div className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Legit. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
