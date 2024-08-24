import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from '../../service/job.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-joblist',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './joblist.component.html',
  styleUrls: ['./joblist.component.css'],
  providers: [JobService] // Provide JobService here
})
export class JoblistComponent implements OnInit {
  jobList: any[] = [];

  constructor(private jobSer: JobService, private router: Router) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobSer.GetActiveJobs().subscribe((res: any) => {
      this.jobList = res.data;
    });
  }

  openJob(id: number): void {
    this.router.navigate(['/job-detail', id]);
  }

  applyForJob(jobId: number): void {
    this.jobSer.ApplyForJob(jobId).subscribe((response: any) => {
      if (response.success) {
        alert('Successfully applied for the job!');
        this.updateJobList(jobId, 'applied');
      }
    });
  }

  markAsFavorite(jobId: number): void {
    this.jobSer.MarkAsFavorite(jobId).subscribe((response: any) => {
      if (response.success) {
        alert('Job marked as favorite!');
        this.updateJobList(jobId, 'favorite');
      }
    });
  }

  removeFromFavorites(jobId: number): void {
    this.jobSer.RemoveFromFavorites(jobId).subscribe((response: any) => {
      if (response.success) {
        alert('Job removed from favorites!');
        this.updateJobList(jobId, 'removeFavorite');
      }
    });
  }

  updateJobList(jobId: number, action: string): void {
    const job = this.jobList.find(j => j.jobId === jobId);
    if (job) {
      if (action === 'applied') {
        job.isApplied = true;
      } else if (action === 'favorite') {
        job.isFavorite = true;
      } else if (action === 'removeFavorite') {
        job.isFavorite = false;
      }
    }
  }

  truncateText(text: string, limit: number): string {
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  }
}
