import { Component, OnInit } from '@angular/core';
import { AdminJobService } from '../../service/admin-job.service';
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr'; 
import { SearchPipe } from '../../pipe/search.pipe';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,SearchPipe
  ],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
  companyApplications: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  searchText: string = '';

  constructor(
    private jobService: AdminJobService,
    private router: Router,
    private toastr: ToastrService 
  ) {}

  ngOnInit() {
    this.loadJobApplications();
  }

  loadJobApplications() {
    this.loading = true;
    this.jobService.getAllApplications().subscribe(
      (applications: any[]) => {
        
        const jobMap = new Map<string, { jobId: string, companyName: string,jobTitle: string, applicationsCount: number, companyLogoUrl: string }>();

        applications.forEach(app => {
          const jobId = app.jobPosting.id; 
          const companyName = app.jobPosting.companyName;
          const jobTitle = app.jobPosting.jobTitle;
          const companyLogoUrl = app.jobPosting.companyLogoUrl;

          if (!jobMap.has(jobId)) {
            jobMap.set(jobId, { 
              jobId: jobId,
              companyName: companyName, 
              jobTitle: jobTitle,
              applicationsCount: 1,
              companyLogoUrl: companyLogoUrl 
            });
          } else {
            jobMap.get(jobId)!.applicationsCount++;
          }
        });

        this.companyApplications = Array.from(jobMap.values());
        this.loading = false;
        
      },
      (error: any) => {
        this.error = 'Error fetching job applications. Please try again later.';
        this.loading = false;
        console.error('Error fetching job applications:', error);
        this.toastr.error('Error fetching job applications. Please try again later.', 'Error'); 
      }
    );
  }

  onViewApplications(jobId: string): void {
    console.log(`Viewing applications for job ID: ${jobId}`);
    this.router.navigate(['/updateapplication', jobId]); 
  }
}
