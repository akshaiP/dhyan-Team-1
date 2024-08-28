import { Component, OnInit } from '@angular/core';
import { JobService } from '../../service/job.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-applicationstatus',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './applicationstatus.component.html',
  styleUrls: ['./applicationstatus.component.css']
})
export class ApplicationStatusComponent implements OnInit {
  applications: any[] = [];

  constructor(private jobService: JobService) { }

  ngOnInit(): void {
    this.fetchApplicationStatus();
  }

  // Method to fetch application status from backend
  fetchApplicationStatus(): void {
    this.jobService.GetUserApplicationStatus(localStorage.getItem('userId')!).subscribe(
      (data) => {
        this.applications = data;
      },
      (error) => {
        console.error('Error fetching application status', error);
      }
    );
  }

  // Method to calculate progress based on the number of completed stages
  getProgress(application: any): number {
    const completedStages = application.stages.filter((stage: { stageStatus: string; }) => stage.stageStatus === 'COMPLETED').length;
    const totalStages = application.stages.length;
    return totalStages > 0 ? (completedStages / totalStages) * 100 : 0;
  }
}
