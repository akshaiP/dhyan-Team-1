import { Component, OnInit } from '@angular/core';
import { JobService } from '../../service/job.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { ThemePalette } from '@angular/material/core';
import { SearchPipe } from '../../pipe/search.pipe';
import { FormsModule } from '@angular/forms';
import { JobPosting } from '../../models/job-posting.model'; 



const STAGE_ORDER = [
  'APPLIED',
  'WRITTEN_TEST',
  'TECHNICAL_INTERVIEW_1',
  'TECHNICAL_INTERVIEW_2',
  'HR_ROUND',
  'JOB_OFFER'
];

@Component({
  selector: 'app-applicationstatus',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatBadgeModule,SearchPipe,FormsModule],
  templateUrl: './applicationstatus.component.html',
  styleUrls: ['./applicationstatus.component.scss']
})
export class ApplicationStatusComponent implements OnInit {
  applications: any[] = [];
  searchText: string = '';

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.fetchApplicationStatus();
    console.log('Applications after load:', this.applications);
  }


  
fetchApplicationStatus(): void {
  this.jobService.GetUserApplicationStatus(localStorage.getItem('userId')!).subscribe(
    (data) => {
      this.applications = data.map((application: { stages: any[]; }) => {
        
        const sortedStages = this.sortStages(application.stages);
        const completedStages = this.fillMissingStages(sortedStages);
        return { ...application, stages: completedStages };
      });
    },
    (error) => {
      console.error('Error fetching application status', error);
    }
  );
}


fillMissingStages(stages: any[]): any[] {
  const filledStages = STAGE_ORDER.map(stageName => {
      const existingStage = stages.find(stage => stage.stageName === stageName);
      if (existingStage) {
          return existingStage; 
      }
     
      return {
          stageName: stageName,
          stageStatus: 'PENDING', 
          completedAt: null 
      };
  });
  return filledStages;
}

 
  sortStages(stages: any[]): any[] {

    return stages.sort((a, b) => {
      const indexA = STAGE_ORDER.indexOf(a.stageName);
      const indexB = STAGE_ORDER.indexOf(b.stageName);
      return indexA - indexB;
    });
  }


  getProgress(application: any): number {
    const totalStages = STAGE_ORDER.length; 
    const completedStages = application.stages.filter((stage: { stageStatus: string; }) => stage.stageStatus === 'COMPLETED').length;
    return (completedStages / totalStages) * 100;
  }

}