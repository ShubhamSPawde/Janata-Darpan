
import React from 'react';
import { BarChart3 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md dark:bg-black/50 border-b border-border sticky top-0 z-10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-medium text-foreground">Janata<span className="text-primary">Darpan</span></h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-foreground/80 hover:text-primary transition-colors">Dashboard</a>
          <a href="#" className="text-foreground/80 hover:text-primary transition-colors">History</a>
          <a href="#" className="text-foreground/80 hover:text-primary transition-colors">Analytics</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button className="btn-apple bg-primary text-white">
            Export Data
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
