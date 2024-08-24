import { Component, NgModule, OnInit } from '@angular/core';
import { JobService } from '../../service/job.service';
import { CommonModule} from '@angular/common';

@Component({
  selector: 'app-favoritejobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favouritejobs.component.html',
  styleUrls: ['./favouritejobs.component.css'],
  
  providers:[JobService]
})
export class FavoriteJobsComponent implements OnInit {
  favoriteJobs: any[] = [];

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadFavoriteJobs();
  }

  loadFavoriteJobs(): void {
    this.jobService.GetFavoriteJobs().subscribe((res: any) => {
      this.favoriteJobs = res.data; // Assuming the API returns { data: [...] }
    });
  }

  applyForJob(jobId: number): void {
    this.jobService.ApplyForJob(jobId).subscribe((response: any) => {
      if (response.success) {
        alert('Successfully applied for the job!');
        this.updateJobList(jobId, 'applied');
      }
    });
  }

  removeFromFavorites(jobId: number): void {
    this.jobService.RemoveFromFavorites(jobId).subscribe((response: any) => {
      if (response.success) {
        alert('Job removed from favorites!');
        this.updateJobList(jobId, 'removeFavorite');
      }
    });
  }

  updateJobList(jobId: number, action: string): void {
    const job = this.favoriteJobs.find(j => j.jobId === jobId);
    if (job) {
      if (action === 'applied') {
        job.isApplied = true;
      } else if (action === 'removeFavorite') {
        this.favoriteJobs = this.favoriteJobs.filter(j => j.jobId !== jobId);
      }
    }
  }

  truncateText(text: string, limit: number): string {
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  }
}
