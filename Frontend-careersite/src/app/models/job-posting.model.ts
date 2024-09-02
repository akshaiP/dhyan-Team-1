export interface JobPosting {
  id: number;
  companyName: string;
  companyLogoUrl: string;
  location: string;
  jobTitle: string;
  jobDescription: string;
  requirements: string;
  employmentType: string; // Full-time, Part-time, Contract, Internship, etc.
  jobCategory: string; // IT, Marketing, Finance, etc.
  experienceLevel: string; // Entry-level, Mid-level, Senior-level, etc.
  educationRequirement: string; // e.g., Bachelor’s Degree, Master’s Degree
  skills: string; // Required skills, separated by commas
  lastDateToApply: string; // Format: "yyyy-MM-dd"
  salaryRange: string; // e.g., "$50,000 - $70,000 per annum"
  currency: string; // e.g., USD, EUR
  contactEmail: string; // HR or recruiter contact
  contactPhone?: string; // Optional: HR or recruiter phone number
  benefits: string; // List of benefits, separated by commas
  applicationProcess: string; // Information about the application process
  companyWebsite: string; // Link to the company's website
  jobLocationType: string; // On-site, Remote, Hybrid
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
}