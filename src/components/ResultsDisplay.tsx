
import React, { useState } from 'react';
import { DataEntry } from '../types';
import { flagPrediction } from '../services/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Flag, CheckCircle2 } from 'lucide-react';

interface ResultsDisplayProps {
  entry: DataEntry | null;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ entry }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [correctValue, setCorrectValue] = useState('');
  const { toast } = useToast();

  if (!entry) {
    return (
      <div className="glass-panel p-6 text-center text-muted-foreground">
        <p>Submit data to see analysis results</p>
      </div>
    );
  }

  const handleFlagClick = () => {
    setDialogOpen(true);
  };

  const handleFlagSubmit = async () => {
    if (!correctValue.trim()) {
      toast({
        title: "Input required",
        description: "Please provide the correct value",
        variant: "destructive",
      });
      return;
    }

    try {
      await flagPrediction(entry.id, correctValue);
      setDialogOpen(false);
      setCorrectValue('');
      toast({
        title: "Thank you",
        description: "Your feedback has been recorded",
      });
    } catch (error) {
      console.error("Error flagging prediction:", error);
      toast({
        title: "Error",
        description: "Failed to record your feedback",
        variant: "destructive",
      });
    }
  };

  const getContentPreview = () => {
    if (entry.inputType === 'text') {
      return <p className="text-sm text-muted-foreground mt-2">{entry.content}</p>;
    } else if (entry.inputType === 'image') {
      return <p className="text-sm text-muted-foreground mt-2">Image: {entry.content.split('/').pop()}</p>;
    } else {
      return <p className="text-sm text-muted-foreground mt-2">Video: {entry.content.split('/').pop()}</p>;
    }
  };

  return (
    <>
      <Card className="glass-panel p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">Analysis Results</h2>
          <div className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs">
            {entry.inputType.toUpperCase()}
          </div>
        </div>
        
        {getContentPreview()}
        
        <div className="mt-6 p-5 rounded-xl bg-secondary/30 border border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Prediction</h3>
            {entry.actual ? (
              <span className="flex items-center text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                <Flag className="w-3 h-3 mr-1" /> Flagged
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-lg">{entry.predicted}</p>
          
          {entry.actual && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center text-xs text-green-600 mb-1">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Corrected Value
              </div>
              <p className="text-lg">{entry.actual}</p>
            </div>
          )}
        </div>
        
        {!entry.actual && (
          <div className="mt-6">
            <Button 
              variant="outline" 
              className="flag-btn flex items-center w-full justify-center"
              onClick={handleFlagClick}
            >
              <Flag className="w-4 h-4 mr-2" />
              Flag Incorrect Prediction
            </Button>
          </div>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide Correct Value</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Help us improve our model by providing the correct prediction.
            </p>
            <Input
              placeholder="Enter the correct value"
              value={correctValue}
              onChange={(e) => setCorrectValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFlagSubmit}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResultsDisplay;
