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
import { ToastrService } from 'ngx-toastr'; 


const STAGE_ORDER = ['APPLIED', 'WRITTEN_TEST', 'TECHNICAL_INTERVIEW_1', 'TECHNICAL_INTERVIEW_2', 'HR_ROUND', 'JOB_OFFER'];

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
  applicantName: string = '';
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
    private router: Router,
    private toastr: ToastrService 
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const jobId = params.get('id');
      this.loadApplications(jobId);
    });
  }

  loadApplications(jobId: string | null): void {
    if (jobId) {
      this.adminJobService.getApplicationsByJobId(jobId).subscribe({
        next: (data) => {
          this.applications = data.map(app => ({
              ...app,
              user: {
                  username: app.user?.username || 'N/A' 
              }
          }));
          this.dataSource.data = this.applications;

          
          if (this.applications.length > 0) {
            this.companyName = this.applications[0].jobPosting.companyName;
            this.jobTitle = this.applications[0].jobPosting.jobTitle;
            this.companyLogo = this.applications[0].jobPosting.companyLogoUrl;
          }

          
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
        },
        error: (error) => {
          console.error('Error loading applications:', error);
          this.toastr.error('Error loading applications. Please try again later.', 'Error'); 
        }
      });
    } else {
      console.error('Job ID is null or undefined');
    }
  }

  updateStatus(application: Application): void {
    if (application.status === 'ACCEPTED' || application.status === 'REJECTED') {
      this.adminJobService.updateApplicationStatus(application.id, application.status).subscribe({
        next: () => {
          this.toastr.success('Status updated successfully!', 'Success'); 
        },
        error: (error) => {
          console.error('Error updating status:', error);
          this.toastr.error('Error updating status. Please try again later.', 'Error'); 
        }
      });
    } else {
      this.toastr.warning('Invalid status selected. Please choose either ACCEPTED or REJECTED.', 'Warning');
    }
  }

  openProfileModal(userProfileId: number): void {
    this.adminJobService.getUserProfile(userProfileId).subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.showProfileModal = true;
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
        this.toastr.error('Error fetching user profile. Please try again later.', 'Error');
      }
    });
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  openStageModal(application: Application): void {
    if (application.status !== 'ACCEPTED') {
      this.toastr.warning('The application must be in the "Accepted" status to update the stage.', 'Warning');
      return;
    }
    this.selectedApplication = application;
    this.selectedStage = application.currentStage;
    this.applicantName = application.user ? application.user.username : 'Unknown';
    this.selectedStageStatus = 'PENDING';
    this.showStageModal = true;
  }

  closeStageModal(): void {
    this.showStageModal = false;
  }

  updateStage(): void {
    if (this.selectedApplication) {
      const { id, currentStage } = this.selectedApplication;

      const currentStageIndex = STAGE_ORDER.indexOf(currentStage);
      const selectedStageIndex = STAGE_ORDER.indexOf(this.selectedStage);

      if (selectedStageIndex < currentStageIndex) {
        
        if (confirm('You are moving the stage backwards. Are you sure you want to proceed?')) {
          this.performStageUpdate(id);
        } else {
          this.toastr.info('Stage update cancelled.', 'Info');
        }
      } else {
        this.performStageUpdate(id);
      }
    }
  }

  performStageUpdate(applicationId: number): void {
    this.adminJobService.updateApplicationStage(applicationId, this.selectedStage, this.selectedStageStatus).subscribe({
      next: () => {
        this.toastr.success('Stage updated successfully!', 'Success');
        this.closeStageModal();
        this.loadApplications(this.route.snapshot.paramMap.get('id'));
      },
      error: (error) => {
        console.error('Error updating stage:', error);
        this.toastr.error('Error updating stage. Please try again later.', 'Error');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/applications']);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    
    // Filter by applicantName or currentStage
    this.dataSource.filterPredicate = (data: Application, filter: string) => {
        const applicantName = data.user ? data.user.username.toLowerCase() : '';
        const currentStage = data.currentStage ? data.currentStage.toLowerCase() : '';
        return applicantName.includes(filter) || currentStage.includes(filter);
    };
    
    this.dataSource.filter = filterValue;
    
    if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
    }
}
}
