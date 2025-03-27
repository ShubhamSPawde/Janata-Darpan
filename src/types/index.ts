
export type InputType = 'text' | 'image' | 'video';

export interface DataEntry {
  id: string;
  inputType: InputType;
  content: string; // text content or file URL
  predicted: string;
  actual: string | null; // null until flagged by user
  timestamp: Date;
}

export interface AnalyticsData {
  totalPredictions: number;
  correctPredictions: number;
  flaggedPredictions: number;
  accuracyRate: number;
  typeBreakdown: {
    text: number;
    image: number;
    video: number;
  };
}
