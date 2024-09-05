import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { AdminJobService } from '../../service/admin-job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Application } from '../../models/application.model';

@Component({
  selector: 'app-updateapplications',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './update-application.component.html',
  styleUrls: ['./update-application.component.scss']
})
export class UpdateApplicationComponent implements OnInit {

  jobTitle!: string;
  companyName!: string;
  companyLogo!: string;
  applications: any[] = [];
  statusOptions: string[] = ['ACCEPTED', 'REJECTED'];
  stageOptions: string[] = ['APPLIED', 'WRITTEN_TEST', 'TECHNICAL_INTERVIEW_1', 'TECHNICAL_INTERVIEW_2', 'HR_ROUND', 'JOB_OFFER'];
  stageStatusOptions: string[] = ['PENDING', 'COMPLETED', 'REJECTED'];
  filteredApplications: any[] | undefined;
  showProfileModal: boolean = false;
  showStageModal: boolean = false;
  userProfile: any;
  selectedApplication: any;
  selectedStage: string = '';
  selectedStageStatus: string = '';

  displayedColumns: string[] = [
    'applicantName',
    'dateApplied',
    'currentStatus',
    'currentStage',
    'actions',
    'userProfile'
  ];
  dataSource = new MatTableDataSource<Application>(this.applications);

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  constructor(
    private adminJobService: AdminJobService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const jobId = params.get('id');
      this.loadApplications(jobId);
    });
  }

  loadApplications(jobId: string | null): void {
    if (jobId) {
      this.adminJobService.getApplicationsByJobId(jobId).subscribe(data => {
        this.applications = data;
        this.dataSource.data = this.applications;

        // Extract company information from the first application
        if (this.applications.length > 0) {
          this.companyName = this.applications[0].jobPosting.companyName;
          this.jobTitle = this.applications[0].jobPosting.jobTitle;
          this.companyLogo = this.applications[0].jobPosting.companyLogoUrl;
        }

        // Assign paginator after data is set
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      });
    } else {
      console.error('Job ID is null or undefined');
    }
  }

  updateStatus(application: Application): void {
    if (application.status === 'ACCEPTED' || application.status === 'REJECTED') {
      this.adminJobService.updateApplicationStatus(application.id, application.status).subscribe(() => {
        console.log('Status updated successfully');
      });
    } else {
      alert('Invalid status selected. Please choose either ACCEPTED or REJECTED.');
    }
  }

  openProfileModal(userProfileId: number): void {
    this.adminJobService.getUserProfile(userProfileId).subscribe(profile => {
      this.userProfile = profile;
      this.showProfileModal = true;
    });
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  openStageModal(application: Application): void {
    if (application.status !== 'ACCEPTED') {
      alert('The application must be in the "Accepted" status to update the stage.');
      return;
    }
    this.selectedApplication = application;
    this.selectedStage = application.currentStage;
    this.selectedStageStatus = 'PENDING';
    this.showStageModal = true;
  }

  closeStageModal(): void {
    this.showStageModal = false;
  }

  updateStage(): void {
    if (this.selectedApplication) {
      const { id } = this.selectedApplication;
      this.adminJobService.updateApplicationStage(id, this.selectedStage, this.selectedStageStatus).subscribe(() => {
        console.log('Stage updated successfully');
        this.closeStageModal();
        this.loadApplications(this.route.snapshot.paramMap.get('id'));
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/applications']);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
