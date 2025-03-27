
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import InputSection from '@/components/InputSection';
import ResultsDisplay from '@/components/ResultsDisplay';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import { DataEntry } from '@/types';
import { getAllEntries } from '@/services/api';

const Index = () => {
  const [currentEntry, setCurrentEntry] = useState<DataEntry | null>(null);
  
  useEffect(() => {
    // Load the most recent entry on initial load
    const loadInitialEntry = async () => {
      const entries = await getAllEntries();
      if (entries.length > 0) {
        setCurrentEntry(entries[0]);
      }
    };
    
    loadInitialEntry();
  }, []);
  
  const handlePredictionComplete = (id: string, prediction: string) => {
    // After a prediction is complete, get the entry and set it as current
    getAllEntries().then(entries => {
      const entry = entries.find(e => e.id === id);
      if (entry) {
        setCurrentEntry(entry);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-4xl font-medium text-center mb-2">Janata Darpan Dashboard</h1>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload text, images, or videos for AI analysis. Flag incorrect predictions to help improve the model.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputSection onPredictionComplete={handlePredictionComplete} />
            <ResultsDisplay entry={currentEntry} />
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-medium mb-6">Analytics & Insights</h2>
          <AnalyticsDashboard />
        </section>
      </main>
      
      <footer className="bg-white/80 backdrop-blur-md dark:bg-black/50 border-t border-border mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
          <p>Janata Darpan • Streamlined Data Processing with Feedback Loop</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
