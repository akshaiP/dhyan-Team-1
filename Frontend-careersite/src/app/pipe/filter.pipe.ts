import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone:true
})
export class FilterPipe implements PipeTransform {
  transform(jobList: any[], location: string, experience: string, jobType: string, salaryRange: string): any[] {
    if (!jobList) {
      return [];
    }
  
    return jobList.filter(job => {
    
      const matchesExperience = experience === 'all' || (job.experienceLevel && job.experienceLevel.toLowerCase() === experience.toLowerCase());
      const matchesLocation = location === 'all' || (job.location && job.location.toLowerCase() === location.toLowerCase());
      const matchesJobType = jobType === 'all' || (job.employmentType && job.employmentType.toLowerCase() === jobType.toLowerCase());
      const matchesSalaryRange = salaryRange === 'all' || (job.salaryRange && job.salaryRange.toLowerCase() === salaryRange.toLowerCase());
  
      return matchesLocation && matchesExperience && matchesJobType && matchesSalaryRange;
    });
  }
  
  
}  
