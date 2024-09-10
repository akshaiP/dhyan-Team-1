export interface AdminDashboard{
    companiesCount: number;
    activeUsersCount: number;
    jobPostingsCount: number;
    totalApplications: number;
    jobTitleApplications: Record<string, number>;
    statusCounts: Record<string, number>;
  }