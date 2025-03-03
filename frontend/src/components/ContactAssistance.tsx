import React, { useState } from "react";
import { Button } from "./Button";
import { cn } from "../utils/cn";

export interface ContactAssistanceProps {
  className?: string;
  variant?: "popup" | "inline" | "floating";
}

export const ContactAssistance: React.FC<ContactAssistanceProps> = ({
  className,
  variant = "inline"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // This would typically send the data to a backend endpoint
    setIsSubmitted(true);
    
    // Reset after 5 seconds if we're in popup mode
    if (variant === "popup" || variant === "floating") {
      setTimeout(() => {
        setIsSubmitted(false);
        setIsOpen(false);
        setFormData({ name: "", email: "", message: "" });
      }, 5000);
    }
  };
  
  // For floating button that opens the contact form
  if (variant === "floating") {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <Button 
            variant="cyber" 
            className="rounded-full h-16 w-16 shadow-lg flex items-center justify-center group hover:scale-105 transition-transform"
            onClick={() => setIsOpen(true)}
          >
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Expert Help</span>
            </div>
          </Button>
        ) : (
          <div className="bg-card/90 backdrop-blur-md border border-cyber-border/50 rounded-md p-4 shadow-lg w-80 border-glow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="text-metal-chrome">NetMax</span><span className="text-metal-highlight">PC</span> Support
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {isSubmitted ? (
              <div className="text-center py-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-metal-chrome mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h4 className="font-medium mb-2">Request Sent!</h4>
                <p className="text-sm text-muted-foreground">Our experts will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-background/50 border border-metal-accent/30 rounded-md focus:outline-none focus:border-metal-chrome transition-all"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 bg-background/50 border border-metal-accent/30 rounded-md focus:outline-none focus:border-metal-chrome transition-all"
                  />
                </div>
                <div>
                  <textarea 
                    name="message" 
                    placeholder="How can we help?"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full p-2 bg-background/50 border border-metal-accent/30 rounded-md focus:outline-none focus:border-metal-chrome transition-all resize-none"
                  ></textarea>
                </div>
                <Button type="submit" variant="cyber" className="w-full">
                  Request Expert Help
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    );
  }
  
  // For a popup that's shown when needed but not always visible
  if (variant === "popup") {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-card border border-cyber-border/50 rounded-md p-6 shadow-lg max-w-md w-full border-glow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <span className="text-metal-chrome">NetMax</span><span className="text-metal-highlight">PC</span> Expert Assistance
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {isSubmitted ? (
            <div className="text-center py-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-metal-chrome mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h4 className="font-medium text-lg mb-2">Request Sent!</h4>
              <p className="text-muted-foreground">Our experts will contact you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 bg-background/50 border border-metal-accent/30 rounded-md focus:outline-none focus:border-metal-chrome transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 bg-background/50 border border-metal-accent/30 rounded-md focus:outline-none focus:border-metal-chrome transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">How can we help?</label>
                <textarea 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full p-2 bg-background/50 border border-metal-accent/30 rounded-md focus:outline-none focus:border-metal-chrome transition-all resize-none"
                ></textarea>
              </div>
              <Button type="submit" variant="cyber" className="w-full">
                Request Expert Help
              </Button>
            </form>
          )}
        </div>
      </div>
    );
  }
  
  // Default is inline form embedded in the page
  return (
    <div className={cn(
      "bg-metal-shadow/80 backdrop-blur-sm border border-metal-accent/50 rounded-md overflow-hidden",
      className
    )}>
      <div className="bg-gradient-to-r from-metal-chrome to-metal-highlight h-1"></div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-md bg-metal-chrome/10 border border-metal-accent/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-metal-chrome" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold flex items-center gap-1">
              <span className="text-metal-chrome">NetMax</span><span className="text-metal-highlight">PC</span> Expert Assistance
            </h3>
            <p className="text-sm text-muted-foreground">Get personalized help from our security experts</p>
          </div>
        </div>
        
        {isSubmitted ? (
          <div className="text-center py-6 bg-background/30 rounded-md border border-metal-chrome/20 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-metal-chrome mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h4 className="font-medium text-lg mb-2">Request Sent!</h4>
            <p className="text-muted-foreground">Our experts will contact you shortly to provide personalized assistance.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 bg-background/50 border border-metal-accent/30 rounded-md focus:outline-none focus:border-metal-chrome transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 bg-background/50 border border-metal-accent/30 rounded-md focus:outline-none focus:border-metal-chrome transition-all"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">How can our experts help you?</label>
              <textarea 
                name="message" 
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe what you're seeing and we'll have one of our security experts contact you..."
                className="w-full p-2 bg-background/50 border border-metal-accent/30 rounded-md focus:outline-none focus:border-metal-chrome transition-all resize-none"
              ></textarea>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-muted-foreground">
                Our experts typically respond within 24 hours
              </div>
              <Button type="submit" variant="cyber">
                Request Expert Help
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
