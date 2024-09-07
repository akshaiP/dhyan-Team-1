export interface Application {
  id: number;
  jobId: number;
  userId: number;
  status: string;
  currentStage: string;
  currentStageStatus: string;
    user: {
      username: string; // Add this if it’s part of your data
  };
  }