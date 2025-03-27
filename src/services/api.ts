
import { DataEntry, AnalyticsData, InputType } from "../types";

// Mock database for frontend demo purposes
// In a production environment, this would connect to your actual database
let mockDatabase: DataEntry[] = [];

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Store input in database
export const storeInput = async (
  inputType: InputType,
  content: string
): Promise<DataEntry> => {
  const newEntry: DataEntry = {
    id: generateId(),
    inputType,
    content,
    predicted: "", // Will be filled after prediction
    actual: null,
    timestamp: new Date(),
  };

  mockDatabase.push(newEntry);
  console.log("Stored input in database:", newEntry);
  return newEntry;
};

// Submit to model via Streamlit
export const submitToModel = async (
  entryId: string,
  inputType: InputType,
  content: string
): Promise<string> => {
  console.log(`Submitting ${inputType} to model via Streamlit...`);
  
  // In a real implementation, this would make an API call to your Streamlit app
  // Simulated delay and response for demo purposes
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock prediction results based on input type
  let prediction = "";
  if (inputType === 'text') {
    prediction = content.length > 10 ? "Positive sentiment" : "Negative sentiment";
  } else if (inputType === 'image') {
    prediction = "Cat image detected";
  } else {
    prediction = "Action detected in video";
  }
  
  // Update the entry in the database with the prediction
  const entry = mockDatabase.find(e => e.id === entryId);
  if (entry) {
    entry.predicted = prediction;
  }
  
  return prediction;
};

// Flag incorrect prediction
export const flagPrediction = async (
  entryId: string,
  actualValue: string
): Promise<boolean> => {
  const entry = mockDatabase.find(e => e.id === entryId);
  if (!entry) return false;
  
  entry.actual = actualValue;
  console.log("Updated entry with correct value:", entry);
  return true;
};

// Get all stored entries
export const getAllEntries = async (): Promise<DataEntry[]> => {
  return [...mockDatabase].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
};

// Get analytics data
export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  const totalPredictions = mockDatabase.length;
  const flaggedPredictions = mockDatabase.filter(entry => entry.actual !== null).length;
  const correctPredictions = mockDatabase.filter(
    entry => entry.actual === null || entry.actual === entry.predicted
  ).length;
  
  const typeBreakdown = {
    text: mockDatabase.filter(entry => entry.inputType === 'text').length,
    image: mockDatabase.filter(entry => entry.inputType === 'image').length,
    video: mockDatabase.filter(entry => entry.inputType === 'video').length,
  };
  
  return {
    totalPredictions,
    correctPredictions,
    flaggedPredictions,
    accuracyRate: totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0,
    typeBreakdown
  };
};
