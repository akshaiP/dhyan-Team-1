import { Component, NgModule, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { JobService } from '../../service/job.service';

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-favoritejobs',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './favouritejobs.component.html',
  styleUrls: ['./favouritejobs.component.scss'],
  providers: [JobService]
})
export class FavoriteJobsComponent implements OnInit {
  favoriteJobs: any[] = [];
  showJobDetailsModal: boolean = false;
  selectedJob: any = null;

  constructor(private jobService: JobService, private toastr: ToastrService) {} 

  ngOnInit(): void {
    this.loadFavoriteJobs();
  }

  loadFavoriteJobs(): void {
    this.jobService.GetFavoriteJobs().subscribe((res: any) => {
      this.favoriteJobs = res.map((item: any) => item.jobPosting);
    });
  }

  removeFromFavorites(jobId: number): void {
    this.jobService.RemoveFromFavorites(jobId).subscribe(() => {
      this.toastr.success('Job removed from favorites!', 'Success'); 
      this.loadFavoriteJobs(); 
    }, error => {
      this.toastr.error('Failed to remove job from favorites.', 'Error'); 
    });
  }

  truncateText(text: string, limit: number): string {
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  }

  viewDetails(job: any): void {
    this.selectedJob = job;
    this.showJobDetailsModal = true;
  }

  closeModal(): void {
    this.showJobDetailsModal = false;
    this.selectedJob = null;
  }
}
