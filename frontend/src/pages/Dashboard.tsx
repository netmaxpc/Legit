import React, { useState } from "react";
import brain from "brain";
import { ScamDetectionResponse } from "types";
import { toast } from "sonner";
import { Button } from "components/Button";
import { CyberShield } from "components/CyberShield";
import { Card, CardContent, CardHeader, CardTitle } from "components/Card";
import { InputAnalysisBox } from "components/InputAnalysisBox";
import { FileUpload } from "components/FileUpload";
import { ScanResultIndicator } from "components/ScanResultIndicator";
import { ContactAssistance } from "components/ContactAssistance";
import { Layout } from "components/Layout";

type AnalysisType = "text" | "file";
type AnalysisStatus = "idle" | "scanning" | "result" | "error";

export default function Dashboard() {
  const [analysisType, setAnalysisType] = useState<AnalysisType>("text");
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>("idle");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<ScamDetectionResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  // Function to handle text analysis using the real API
  const handleAnalyzeText = async (text: string) => {
    console.log("Analyzing text:", text);
    setIsAnalyzing(true);
    setAnalysisStatus("scanning");
    setScanResult(null);
    setAnalysisError(null);
    
    try {
      // Determine content type (simple heuristic)
      let contentType = "text";
      if (text.includes("@") && text.includes(".")) {
        contentType = "email";
      } else if (text.startsWith("http") || text.includes("www.") || text.includes(".")) {
        contentType = "url";
      } else if (/^[\d\+\-\(\)\s]+$/.test(text)) { // Simple regex for phone numbers
        contentType = "phone";
      }
      
      // Call the API
      const response = await brain.detect_scam({
        content: text,
        content_type: contentType
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result: ScamDetectionResponse = await response.json();
      setScanResult(result);
      setAnalysisStatus("result");
    } catch (error) {
      console.error("Error analyzing text:", error);
      setAnalysisError(error instanceof Error ? error.message : "Unknown error occurred");
      setAnalysisStatus("error");
      toast.error("Failed to analyze content. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Function to handle file upload - using OCR to extract text from images
  const handleFileUpload = async (file: File) => {
    console.log("File uploaded:", file.name, file.type, file.size);
    setIsAnalyzing(true);
    setAnalysisStatus("scanning");
    setScanResult(null);
    setAnalysisError(null);
    
    try {
      // Convert file to base64 string
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      
      fileReader.onload = async () => {
        if (fileReader.result) {
          // Implement OCR here when we have that functionality
          // For now, we'll analyze a placeholder text
          toast.info("Screenshot analysis is coming soon. For now, we'll check a sample text.");
          
          // This is a placeholder until we implement OCR
          const placeholderText = "This is extracted text from the screenshot. We're working on OCR functionality.";
          
          const response = await brain.detect_scam({
            content: placeholderText,
            content_type: "image_text"
          });
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }
          
          const result: ScamDetectionResponse = await response.json();
          setScanResult(result);
          setAnalysisStatus("result");
        }
        setIsAnalyzing(false);
      };
      
      fileReader.onerror = () => {
        throw new Error("Failed to read file");
      };
    } catch (error) {
      console.error("Error analyzing file:", error);
      setAnalysisError(error instanceof Error ? error.message : "Unknown error occurred");
      setAnalysisStatus("error");
      toast.error("Failed to analyze image. Please try again.");
      setIsAnalyzing(false);
    }
  };
  
  // Function to get the right threat color based on threat level
  const getThreatStyles = (threatLevel: string) => {
    switch (threatLevel) {
      case "dangerous":
        return {
          color: "text-red-500",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/30",
          gradientFrom: "from-red-500",
          gradientTo: "to-red-600",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          title: "Dangerous Content Detected",
          description: "This content has strong indicators of being a scam or fraudulent."
        };
      case "suspicious":
        return {
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/20",
          borderColor: "border-yellow-500/30",
          gradientFrom: "from-yellow-500",
          gradientTo: "to-yellow-600",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          title: "Suspicious Content Detected",
          description: "This content shows signs of being potentially fraudulent."
        };
      case "safe":
      default:
        return {
          color: "text-green-500",
          bgColor: "bg-green-500/20",
          borderColor: "border-green-500/30",
          gradientFrom: "from-green-500",
          gradientTo: "to-green-600",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          title: "Content Appears Safe",
          description: "No suspicious elements were detected in this content."
        };
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
            <a href="/dashboard" className="text-metal-chrome font-medium border-b-2 border-metal-chrome">Dashboard</a>
            <a href="/history" className="text-foreground hover:text-metal-chrome transition-colors">History</a>
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
            <h2 className="text-3xl font-bold mb-2">Scam Checker <span className="text-metal-chrome">Dashboard</span></h2>
            <p className="text-muted-foreground">Check if messages, websites, or calls are real or fake in seconds.</p>
          </div>
          
          {/* Tab selection for analysis type */}
          <div className="flex border-b border-metal-accent/30 mb-6">
            <button
              className={`py-2 px-4 font-medium ${analysisType === 'text' ? 'border-b-2 border-metal-chrome text-metal-chrome' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setAnalysisType("text")}
            >
              Check Text or Link
            </button>
            <button
              className={`py-2 px-4 font-medium ${analysisType === 'file' ? 'border-b-2 border-metal-chrome text-metal-chrome' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setAnalysisType("file")}
            >
              Check Screenshot
            </button>
          </div>
          
          {/* Analysis input section */}
          <Card className="bg-metal-shadow/80 backdrop-blur-sm border-metal-accent/30 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-metal-chrome to-metal-highlight"></div>
            <CardHeader>
              <div className="flex items-center">
                <CardTitle className="flex items-center gap-2">
                  {analysisStatus === "scanning" ? (
                    <ScanResultIndicator status="scanning" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-metal-chrome" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )}
                  {analysisType === "text" ? "Check Text or Link" : "Check Screenshot"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisType === "text" ? (
                  <InputAnalysisBox 
                    onAnalyze={handleAnalyzeText} 
                    isLoading={isAnalyzing}
                  />
                ) : (
                  <FileUpload 
                    onUpload={handleFileUpload} 
                    accept="image/*"
                    maxSize={5}
                  />
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Expert assistance section */}
          <div className="mt-8">
            <ContactAssistance />
          </div>

          {/* Results section - only shown after analysis */}
          {analysisStatus === "error" && (
            <div className="mt-8 p-4 border border-red-500/30 rounded-md bg-red-500/10 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium mb-1">Analysis Failed</h3>
              <p className="text-muted-foreground mb-3">{analysisError || "An unexpected error occurred. Please try again."}</p>
              <Button 
                variant="cyber-outline" 
                className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                onClick={() => setAnalysisStatus("idle")}
              >
                Try Again
              </Button>
            </div>
          )}
          
          {analysisStatus === "result" && scanResult && (
            <Card className="mt-8 bg-metal-shadow/80 backdrop-blur-sm border-metal-accent/30 overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getThreatStyles(scanResult.threat_level).gradientFrom} ${getThreatStyles(scanResult.threat_level).gradientTo}`}></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScanResultIndicator status={scanResult.threat_level as "safe" | "suspicious" | "dangerous"} />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Threat level indicator */}
                  <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border ${getThreatStyles(scanResult.threat_level).borderColor} rounded-md ${getThreatStyles(scanResult.threat_level).bgColor}`}>
                    <div className="flex items-center gap-3 mb-3 sm:mb-0">
                      <div className={`rounded-full ${getThreatStyles(scanResult.threat_level).bgColor} p-2`}>
                        {getThreatStyles(scanResult.threat_level).icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{getThreatStyles(scanResult.threat_level).title}</h3>
                        <p className="text-sm text-muted-foreground">{getThreatStyles(scanResult.threat_level).description}</p>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto flex items-center">
                      <div className="w-full sm:w-32 h-3 bg-background rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getThreatStyles(scanResult.threat_level).gradientFrom} ${getThreatStyles(scanResult.threat_level).gradientTo}`}
                          style={{ width: `${Math.round(scanResult.confidence_score * 100)}%` }}
                        ></div>
                      </div>
                      <span className={`ml-2 text-sm font-medium ${getThreatStyles(scanResult.threat_level).color}`}>
                        {Math.round(scanResult.confidence_score * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Analysis details */}
                  <div className="border border-metal-accent/30 rounded-md divide-y divide-metal-accent/20">
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">DETECTED ISSUES</h4>
                      {scanResult.indicators && scanResult.indicators.length > 0 ? (
                        <ul className="space-y-2">
                          {scanResult.indicators.map((indicator, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${getThreatStyles(scanResult.threat_level).color} mt-0.5 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <div>
                                <p className="font-medium">{indicator.name}</p>
                                <p className="text-sm text-muted-foreground">{indicator.description}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No specific issues were detected.</p>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">RECOMMENDATION</h4>
                      <div className={`bg-${getThreatStyles(scanResult.threat_level).color.replace('text-', '')}/5 border ${getThreatStyles(scanResult.threat_level).borderColor} rounded-md p-3`}>
                        <p className={`font-medium ${getThreatStyles(scanResult.threat_level).color} mb-1`}>
                          {scanResult.is_scam ? "Be careful with this content" : "This content appears to be legitimate"}
                        </p>
                        <div className="text-sm text-muted-foreground space-y-2">
                          <p>{scanResult.analysis}</p>
                          {scanResult.recommendations && scanResult.recommendations.length > 0 && (
                            <ul className="list-disc list-inside pl-1 pt-1 space-y-1">
                              {scanResult.recommendations.map((rec, index) => (
                                <li key={index}>{rec}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button variant="cyber" className="flex-1 bg-metal-chrome text-metal-shadow hover:bg-metal-highlight">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Save Report
                    </Button>
                    <Button variant="cyber-outline" className="flex-1 border-metal-chrome text-metal-chrome hover:bg-metal-accent/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Learn More
                    </Button>
                    <Button variant="outline" className="flex-1 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                      Report False Positive
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Floating contact button for mobile */}
      <ContactAssistance variant="floating" />
      
      {/* Footer */}
      <footer className="border-t border-metal-accent/30 py-4">
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
  );
    </Layout>
  );
}
