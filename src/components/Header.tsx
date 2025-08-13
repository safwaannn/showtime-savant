import { Button } from "@/components/ui/button";
import { Film, User, Settings } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <header className="bg-cinema-dark border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Film className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            CinemaBook
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="/" className="text-foreground hover:text-primary transition-colors">
            Movies
          </a>
          <a href="/theaters" className="text-foreground hover:text-primary transition-colors">
            Theaters
          </a>
          <a href="/offers" className="text-foreground hover:text-primary transition-colors">
            Offers
          </a>
        </nav>

        {/* Auth & Admin */}
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/admin'}
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="h-4 w-4 mr-2" />
              Admin Panel
            </Button>
          )}
          
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
          
          <Button 
            variant="default" 
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;