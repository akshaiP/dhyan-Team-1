import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobService } from '../../service/job.service';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit {
  activeJobId: number = 0;
  jobObj: any;
  isApplied: boolean = false; // Track if the job is applied
  isFavorite: boolean = false; // Track if the job is marked as favorite

  constructor(private activatedRoute: ActivatedRoute, private jobService: JobService) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.activeJobId = +params['jobid']; // Convert jobid to a number
      this.getJobDetail();
    });
  }

  getJobDetail(): void {
    this.jobService.GetJobListingById(this.activeJobId).subscribe((response: any) => {
      this.jobObj = response.data;
      // Check if the job is already marked as favorite
      this.isFavorite = response.data.isFavorite; // Assuming the backend returns this info
    });
  }

  applyForJob(): void {
    this.jobService.ApplyForJob(this.activeJobId).subscribe((response: any) => {
      if (response.success) {
        this.isApplied = true; // Change the button state to applied
      }
    });
  }

  toggleFavorite(): void {
    if (this.isFavorite) {
      this.jobService.RemoveFromFavorites(this.activeJobId).subscribe((response: any) => {
        if (response.success) {
          this.isFavorite = false; // Change the button state to "Mark as Favorite"
        }
      });
    } else {
      this.jobService.MarkAsFavorite(this.activeJobId).subscribe((response: any) => {
        if (response.success) {
          this.isFavorite = true; // Change the button state to "Remove from Favorite"
        }
      });
    }
  }
}
