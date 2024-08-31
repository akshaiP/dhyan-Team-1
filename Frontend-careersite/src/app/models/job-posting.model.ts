export interface JobPosting {
    id: number;
    companyName: string;
    companyLogoUrl: string;
    location: string;
    jobTitle: string;
    jobDescription: string;
    requirements: string;
    lastDateToApply: string;
    status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  }