import { Component, OnInit, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../service/job.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SearchPipe } from '../../pipe/search.pipe';
import { FilterPipe } from '../../pipe/filter.pipe';

@Component({
  selector: 'app-joblist',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, SearchPipe,FilterPipe],
  templateUrl: './joblist.component.html',
  styleUrls: ['./joblist.component.css'],
  providers: [JobService]
})
export class JoblistComponent implements OnInit {
  jobList: any[] = [];
  searchText: string = '';
  showJobDetailsModal: boolean = false;
  selectedJob: any = null;

  selectedLocation: string = 'all'; // empty or any default value 
  selectedExperience: string = 'all';
  selectedJobType: string = 'all';
  selectedSalaryRange: string = 'all';

  constructor(private jobSer: JobService, private router: Router) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobSer.GetActiveJobs().subscribe(
      (res: any) => {
        console.log('Job List Response:', res);
        this.jobList = res;
        this.checkApplications();
        this.checkFavorites();
      },
      (error: any) => {
        console.error('Error loading jobs:', error);
      }
    );
  }

  openJobDetailsModal(job: any, event: Event): void {
    event.preventDefault(); // Prevent the default behavior of the anchor tag
    this.selectedJob = job;
    this.showJobDetailsModal = true;
  }

  closeJobDetailsModal(): void {
    this.showJobDetailsModal = false;
    this.selectedJob = null;
  }

  applyForJob(jobId: number): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User not logged in!');
      return;
    }
    const request = { jobId: jobId, userId: +userId };
    this.jobSer.ApplyForJob(request).subscribe((response: any) => {
      if (response) {
        alert('Successfully applied for the job!');
        this.updateJobList(jobId, 'applied');
      } else {
        console.error('Error applying for the job:', response);
      }
    });
  }

  toggleFavorite(jobId: number): void {
    const job = this.jobList.find(j => j.id === jobId);
    if (job) {
      if (job.isFavorite) {
        this.removeFromFavorites(jobId);
      } else {
        this.markAsFavorite(jobId);
      }
    }
    job.isFavorite = !job.isFavorite;
  }

  markAsFavorite(jobId: number): void {
    this.jobSer.MarkAsFavorite(jobId).subscribe((response: any) => {
      if (response.success) {
        alert('Job marked as favorite!');
        this.updateJobList(jobId, 'favorite');
      } else {
        console.error('Error marking job as favorite:', response);
      }
    });
  }

  removeFromFavorites(jobId: number): void {
    this.jobSer.RemoveFromFavorites(jobId).subscribe((response: any) => {
      if (response.success) {
        alert('Job removed from favorites!');
        this.updateJobList(jobId, 'removeFavorite');
      } else {
        console.error('Error removing job from favorites:', response);
      }
    });
  }

  updateJobList(jobId: number, action: string): void {
    const job = this.jobList.find(j => j.id === jobId);
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

  checkApplications(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.jobSer.GetUserApplications(userId).subscribe((res: any) => {
        const appliedJobIds = new Set(res.map((app: any) => app.jobPosting.id));
        this.jobList.forEach(job => {
          job.isApplied = appliedJobIds.has(job.id);
        });
      });
    }
  }

  checkFavorites(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.jobSer.GetFavoriteJobs().subscribe((res: any) => {
        const favoriteJobIds = new Set(res.map((fav: any) => fav.jobPosting.id));
        this.jobList.forEach(job => {
          job.isFavorite = favoriteJobIds.has(job.id);
        });
      });
    }
  }
}