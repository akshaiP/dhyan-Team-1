export interface JobPosting {
  id: number;
  companyName: string;
  companyLogoUrl: string;
  location: string;
  jobTitle: string;
  jobDescription: string;
  requirements: string;
  employmentType: string; // Full-time, Part-time, Contract, Internship
  jobCategory: string; // IT, Marketing, Finance
  experienceLevel: string; // Entry-level, Mid-level, Senior-level
  educationRequirement: string; // Bachelor’s Degree, Master’s Degree
  skills: string; // Required skills, separated by commas
  lastDateToApply: string; // Format: "yyyy-MM-dd"
  salaryRange: string; // "$50,000 - $70,000 per annum"
  currency: string; // USD, EUR
  contactEmail: string; // HR or recruiter contact
  contactPhone?: string; // HR or recruiter phone number
  benefits: string; // List of benefits, separated by commas
  applicationProcess: string; // Information about the application process
  companyWebsite: string; // Link to the company's website
  jobLocationType: string; // On-site, Remote, Hybrid
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
}