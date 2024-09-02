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
      const jobExperience = job.experienceLevel ? job.experienceLevel.toLowerCase().trim() : '';
      const selectedExperience = experience ? experience.toLowerCase().trim() : '';
  
      // job experience level for matching
      let experienceMatch = false;
      if (selectedExperience === 'entry') {
        experienceMatch = jobExperience.includes('entry');
      } else if (selectedExperience === 'mid') {
        experienceMatch = jobExperience.includes('mid');
      } else if (selectedExperience === 'senior') {
        experienceMatch = jobExperience.includes('senior');
      } else {
        experienceMatch = selectedExperience === 'all';
      }
  
      
      const matchesLocation = location === 'all' || job.location.toLowerCase() === location.toLowerCase();
      const matchesJobType = jobType === 'all' || job.employmentType.toLowerCase() === jobType.toLowerCase();
      const matchesSalaryRange = salaryRange === 'all' || job.salaryRange.toLowerCase() === salaryRange.toLowerCase();
  
      return matchesLocation && experienceMatch && matchesJobType && matchesSalaryRange;
    });
  }
  
  
}  
