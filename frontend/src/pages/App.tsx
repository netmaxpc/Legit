import React from "react";
import { Button } from "components/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "components/Card";
import { CyberShield } from "components/CyberShield";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-metal-dark overflow-hidden relative">
      {/* Background metal shine elements */}
      <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-metal-accent/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-metal-chrome/10 rounded-full blur-3xl"></div>
      
      {/* Header section */}
      <header className="relative z-10 border-b border-metal-accent/30 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CyberShield className="w-10 h-10" glowing />
            <h1 className="text-2xl font-bold tracking-tight text-metal-chrome">Legit</h1>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-metal-chrome font-medium border-b-2 border-metal-chrome">Home</a>
              <a href="/dashboard" className="text-foreground hover:text-metal-chrome transition-colors">Dashboard</a>
              <a href="/history" className="text-foreground hover:text-metal-chrome transition-colors">History</a>
              <a href="#" className="text-foreground hover:text-metal-chrome transition-colors">Resources</a>
            </nav>
            <div className="flex gap-4">
              <Button variant="cyber-outline" size="sm">Login</Button>
              <Button variant="cyber" size="sm">Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3">
                <span className="text-metal-chrome">Is it</span>
                <span className="text-metal-highlight"> Real</span> or Fake?
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Legit checks if messages, websites, or phone calls are real or scams. Just share what you're unsure about, and we'll tell you if it's safe in simple terms.
              </p>
              <div className="flex gap-4">
                <Button variant="cyber" size="lg" className="group bg-metal-chrome text-metal-shadow hover:bg-metal-highlight">
                  Get Started
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Button>
                <Button variant="cyber-outline" className="border-metal-chrome text-metal-chrome hover:bg-metal-accent/10">Learn More</Button>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <CyberShield className="w-64 h-64 md:w-72 md:h-72" glowing />
              <div className="absolute inset-0 bg-gradient-to-r from-metal-chrome/30 to-metal-highlight/30 rounded-full blur-3xl mix-blend-overlay opacity-50"></div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <Card className="bg-metal-shadow/80 backdrop-blur-sm border-metal-accent/30">
            <CardHeader>
              <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-md bg-metal-accent/10 border border-metal-chrome/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-metal-chrome" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <CardTitle className="text-xl">Instant Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Check any message, link, or phone number in seconds to see if it's safe or dangerous.</p>
            </CardContent>
          </Card>

          <Card className="bg-metal-shadow/80 backdrop-blur-sm border-metal-accent/30">
            <CardHeader>
              <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-md bg-metal-accent/10 border border-metal-chrome/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-metal-chrome" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <CardTitle className="text-xl">Threat Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Get easy-to-understand explanations about why something might be risky or safe.</p>
            </CardContent>
          </Card>

          <Card className="bg-metal-shadow/80 backdrop-blur-sm border-metal-accent/30">
            <CardHeader>
              <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-md bg-metal-accent/10 border border-metal-chrome/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-metal-chrome" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </div>
              <CardTitle className="text-xl">Action Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Simple instructions on what to do next if you find a scam or suspicious message.</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Call to action section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-metal-chrome/10 to-metal-highlight/10 blend-overlay"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6 text-metal-chrome">Want to stay safe from scams?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">Join others who check before they click with our simple scanning tool.</p>
          <Button variant="cyber" size="lg" className="bg-metal-chrome text-metal-shadow hover:bg-metal-highlight">
            Try It Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-metal-accent/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <CyberShield className="w-8 h-8" />
              <span className="text-lg font-semibold">Legit</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Legit. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
