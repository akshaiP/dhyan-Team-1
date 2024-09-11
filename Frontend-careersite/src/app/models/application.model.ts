export interface Application {
  id: number;
  jobId: number;
  userId: number;
  status: string;
  currentStage: string;
  currentStageStatus: string;
    user: {
      username: string; 
  };
  }