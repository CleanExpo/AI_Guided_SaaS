import React from 'react';

export function Footer() {
  return (
    <footer className="-t bg-background">
          <div className="container py-8">
        <div className="glass grid grid-cols-1 md:grid-cols-4 gap-8">
          <div></div>
            <h3 className="font-bold text-lg mb-4">AI Guided SaaS</h3>
            <p className="text-sm text-muted-foreground">
              Complete AI-powered SaaS development platform
            
          </div>
          
          <div>
          <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
          <li></li>
                <a href="/features" className="text-muted-foreground hover:text-foreground">
                  Features
                
              </li>
              <li>
          <a href="/pricing" className="text-muted-foreground hover:text-foreground">
                  Pricing
                
              </li>
              <li>
          <a href="/docs" className="text-muted-foreground hover:text-foreground">
                  Documentation
                
              </li>
            
          </div>
          
          <div>
          <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
          <li></li>
                <a href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                
              </li>
              <li>
          <a href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                
              </li>
              <li>
          <a href="/careers" className="text-muted-foreground hover:text-foreground">
                  Careers
                
              </li>
            
          </div>
          
          <div>
          <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
          <li></li>
                <a href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy
                
              </li>
              <li>
          <a href="/terms" className="text-muted-foreground hover:text-foreground">  
                  Terms
                
              </li>
            
          </div>
        <div className="-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2024 AI Guided SaaS. All rights reserved.
        </div>
  )
}
