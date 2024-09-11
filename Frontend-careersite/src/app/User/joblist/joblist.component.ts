import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA,inject } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from '../../service/job.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SearchPipe } from '../../pipe/search.pipe';
import { FilterPipe } from '../../pipe/filter.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule,MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr'; 
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog.component';

@Component({
  selector: 'app-joblist',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    SearchPipe,
    MatIconModule,
    FilterPipe,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './joblist.component.html',
  styleUrls: ['./joblist.component.scss'],
  providers: [JobService],
})
export class JoblistComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  jobList: any[] = [];
  searchText: string = '';
  showJobDetailsModal: boolean = false;
  selectedJob: any = null;

  selectedLocation: string = 'all';  
  selectedExperience: string = 'all';
  selectedJobType: string = 'all';
  selectedSalaryRange: string = 'all';

  locations: string[] = [];
  experienceLevels: string[] = [];
  jobTypes: string[] = [];
  salaryRanges: string[] = [];

  constructor(private jobSer: JobService, private router: Router, private toastr: ToastrService) {} 
  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobSer.GetActiveJobs().subscribe(
      (res: any) => {
        console.log('Job List Response:', res);
        this.jobList = res;
        this.extractFilterOptions();
        this.checkApplications();
        this.checkFavorites();
      },
      (error: any) => {
        console.error('Error loading jobs:', error);
        this.toastr.error('Failed to load jobs. Please try again later.', 'Error'); 
      }
    );
  }

  resetFilters(): void {
    this.selectedLocation = 'all';
    this.selectedExperience = 'all';
    this.selectedJobType = 'all';
    this.selectedSalaryRange = 'all';
    this.loadJobs();
  }

  extractFilterOptions(): void {

    this.locations = Array.from(new Set(this.jobList.map(job => job.location))).filter(loc => loc);
    this.experienceLevels = Array.from(new Set(this.jobList.map(job => job.experienceLevel))).filter(exp => exp);
    this.jobTypes = Array.from(new Set(this.jobList.map(job => job.employmentType))).filter(type => type);
    this.salaryRanges = Array.from(new Set(this.jobList.map(job => job.salaryRange))).filter(salary => salary);
    
  }

  openJobDetailsModal(job: any, event: Event): void {
    event.preventDefault(); 
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
      this.toastr.warning('User not logged in!', 'Warning'); 
      return;
    }
    const request = { jobId: jobId, userId: +userId };
    this.jobSer.ApplyForJob(request).subscribe(
      (response: any) => {
        if (response) {
          this.toastr.success('Successfully applied for the job!', 'Success'); 
          this.updateJobList(jobId, 'applied');
        } else {
          this.toastr.error('Error applying for the job.', 'Error'); 
          console.error('Error applying for the job:', response);
        }
      },
      (error: any) => {
        console.error('Error applying for the job:', error);
        this.toastr.error('An error occurred while applying for the job. Please try again.', 'Error'); }
    );
  }

  unapplyForJob(jobId: number): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.toastr.warning('User not logged in!', 'Warning'); 
      return;
    }
  
    
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirm Unapply',
        message: 'Are you sure you want to unapply from this job?'
      }
    });
  
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const request = { jobId: jobId, userId: +userId };
        this.jobSer.UnapplyForJob(request).subscribe(
          () => {
            this.toastr.success('Successfully removed application!', 'Success'); 
            this.updateJobList(jobId, 'unapplied');
          },
          (error: any) => {
            console.error('Error removing application:', error);
            this.toastr.error('An error occurred while removing the application. Please try again.', 'Error');
          }
        );
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
    this.jobSer.MarkAsFavorite(jobId).subscribe(
      (response: any) => {
        if (response.success) {
          this.toastr.success('Job marked as favorite!', 'Success'); 
          this.updateJobList(jobId, 'favorite');
        } else {
          //this.toastr.error('Error marking job as favorite.', 'Error'); 
          this.toastr.success('Job marked as favorite!', 'Success');     
          
        }
      },
      (error: any) => {
       
        this.toastr.error('An error occurred while marking the job as favorite. Please try again.', 'Error'); 
      }
    );
  }

  removeFromFavorites(jobId: number): void {
    this.jobSer.RemoveFromFavorites(jobId).subscribe(
      () => {
        this.toastr.success('Job removed from favorites!', 'Success');
        this.updateJobList(jobId, 'removeFavorite');
      },
      (error: any) => {
        console.error('Error removing job from favorites:', error);
        this.toastr.error('An error occurred while removing the job from favorites. Please try again.', 'Error');
      }
    );
  }

  updateJobList(jobId: number, action: string): void {
    const job = this.jobList.find(j => j.id === jobId);
    if (job) {
      if (action === 'applied') {
        job.isApplied = true;
        job.applicationStatus = 'PENDING'; 
      } else if (action === 'unapplied') {
        job.isApplied = false;
        job.applicationStatus = 'UNAPPLIED'; 
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
      this.jobSer.GetUserApplications(userId).subscribe(
        (res: any) => {
          const appliedJobs = res.reduce((acc: any, app: any) => {
            acc[app.jobPosting.id] = app.status;
            return acc;
          }, {});
          this.jobList.forEach(job => {
            job.isApplied = appliedJobs.hasOwnProperty(job.id);
            job.applicationStatus = appliedJobs[job.id] || 'PENDING';
          });
        },
        (error: any) => {
          console.error('Error checking user applications:', error);
          this.toastr.error('Failed to check applications. Please try again later.', 'Error'); 
        }
      );
    }
  }

  checkFavorites(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.jobSer.GetFavoriteJobs().subscribe(
        (res: any) => {
          const favoriteJobIds = new Set(res.map((fav: any) => fav.jobPosting.id));
          this.jobList.forEach(job => {
            job.isFavorite = favoriteJobIds.has(job.id);
          });
        },
        (error: any) => {
          
          this.toastr.error('Failed to check favorites. Please try again later.', 'Error');
        }
      );
    }
  }
}
