
import React, { useState } from 'react';
import { storeInput, submitToModel } from '../services/api';
import { InputType } from '../types';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

interface InputSectionProps {
  onPredictionComplete: (id: string, prediction: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ onPredictionComplete }) => {
  const [inputType, setInputType] = useState<InputType>('text');
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileInput, setFileInput] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileInput(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if ((inputType === 'text' && !textInput) || 
        ((inputType === 'image' || inputType === 'video') && !fileInput)) {
      toast({
        title: "Input required",
        description: "Please provide input before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Content is either text or a placeholder URL for files
      const content = inputType === 'text' 
        ? textInput 
        : fileInput ? `${inputType}/${fileInput.name}` : '';
      
      // Store the input in the database
      const entry = await storeInput(inputType, content);
      
      // Send to model via Streamlit
      const prediction = await submitToModel(entry.id, inputType, content);
      
      // Notify parent component of prediction
      onPredictionComplete(entry.id, prediction);
      
      // Reset form
      setTextInput('');
      setFileInput(null);
      
      toast({
        title: "Prediction complete",
        description: "Your input has been processed successfully",
      });
    } catch (error) {
      console.error("Error processing input:", error);
      toast({
        title: "Processing error",
        description: "There was an error processing your input",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 animate-fade-in">
      <h2 className="text-xl font-medium mb-4">Submit Data for Analysis</h2>
      
      <Tabs defaultValue="text" className="w-full" onValueChange={(v) => setInputType(v as InputType)}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4">
          <Textarea
            placeholder="Enter text for analysis..."
            className="input-apple min-h-[120px]"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
        </TabsContent>
        
        <TabsContent value="image" className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
            {fileInput ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Selected file: {fileInput.name}</p>
                <button 
                  className="text-primary text-sm"
                  onClick={() => setFileInput(null)}
                >
                  Change file
                </button>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mb-4">Upload an image for analysis</p>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  onChange={handleFileChange}
                />
                <label 
                  htmlFor="image-upload"
                  className="btn-apple bg-secondary text-secondary-foreground cursor-pointer inline-block"
                >
                  Select Image
                </label>
              </>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="video" className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
            {fileInput ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Selected file: {fileInput.name}</p>
                <button 
                  className="text-primary text-sm"
                  onClick={() => setFileInput(null)}
                >
                  Change file
                </button>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mb-4">Upload a video for analysis</p>
                <Input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  id="video-upload"
                  onChange={handleFileChange}
                />
                <label 
                  htmlFor="video-upload"
                  className="btn-apple bg-secondary text-secondary-foreground cursor-pointer inline-block"
                >
                  Select Video
                </label>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <button 
          className="btn-apple bg-primary text-white w-full"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Analyze"}
        </button>
      </div>
    </div>
  );
};

export default InputSection;
