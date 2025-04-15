
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-tea-green/20 p-4">
      <div className="glass-panel max-w-md mx-auto text-center p-8 rounded-xl">
        <div className="w-20 h-20 rounded-full bg-cambridge-blue/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">404</span>
        </div>
        
        <h1 className="text-3xl font-bold font-montserrat mb-3 text-oxford-blue">Page Not Found</h1>
        
        <p className="mb-6 text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <Button variant="default" asChild>
          <Link to="/dashboard" className="flex items-center gap-2">
            <Home size={18} />
            <span>Go to Dashboard</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
