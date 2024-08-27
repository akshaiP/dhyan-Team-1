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

  fetchApplicationStatus(): void {
    this.jobService.GetApplicationStatus().subscribe(
      (data) => {
        this.applications = data;
      },
      (error) => {
        console.error('Error fetching application status', error);
      }
    );
  }
}
