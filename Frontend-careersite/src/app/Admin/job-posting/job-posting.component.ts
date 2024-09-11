import { Component, OnInit,inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminJobService } from '../../service/admin-job.service';
import { CommonModule } from '@angular/common';
import { MatCardModule} from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogActions,MatDialogClose, MatDialogTitle, MatDialogContent} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { JobPosting } from '../../models/job-posting.model';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from '../../dialog/confirmation-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SearchPipe } from '../../pipe/search.pipe';


@Component({
  selector: 'app-job-postings',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,MatDialogModule,MatCardModule,MatIconModule,
    MatFormFieldModule,MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent,MatTooltipModule,
    MatInputModule,MatSelectModule,SearchPipe,
    MatButtonModule],
  templateUrl: './job-posting.component.html',
  styleUrls: ['./job-posting.component.scss']
})
export class JobPostingComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  jobForm!: FormGroup; 
  jobPostings: JobPosting[] = []; 
  showModal: boolean = false;
  searchText: string = '';
  

  constructor(
    private fb: FormBuilder,
    private jobService: AdminJobService,
    private toastr: ToastrService 
  ) { }

  ngOnInit(): void {
    this.initializeForm(); 
    this.loadJobPostings(); 
  }

  initializeForm() {
    this.jobForm = this.fb.group({
      id: [null],
      companyName: ['', Validators.required],
      companyLogoUrl: [''],
      location: ['', Validators.required],
      jobTitle: ['', Validators.required],
      jobDescription: [''],
      requirements: [''],
      employmentType: [''],
      jobCategory: [''],
      experienceLevel: [''],
      educationRequirement: [''],
      skills: [''],
      lastDateToApply: ['', Validators.required],
      salaryRange: [''],
      currency: [''],
      contactEmail: [''],
      contactPhone: [''],
      benefits: [''],
      applicationProcess: [''],
      companyWebsite: [''],
      jobLocationType: [''],
      status: ['ACTIVE'] 
    });
  }

  toggleModal() {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.jobForm.reset(); 
      this.jobForm.patchValue({ status: 'ACTIVE' }); 
    }
  }

  createJobPosting() {
    if (this.jobForm.valid) {
      const jobData: JobPosting = this.jobForm.value;
      this.jobService.createJob(jobData).subscribe({
        next: () => {
          this.loadJobPostings(); 
          this.toggleModal(); 
          this.toastr.success('Job posting created successfully!', 'Success'); 
        },
        error: (error) => {
          console.error('Error creating job posting:', error);
          this.toastr.error('Error creating job posting. Please try again later.', 'Error'); 
        }
      });
    }
  }

  loadJobPostings() {
    this.jobService.getJobs().subscribe({
      next: (response: JobPosting[]) => {
        this.jobPostings = response;
      },
      error: (error) => {
        console.error('Error loading job postings:', error);
       
      }
    });
  }

  editJob(job: JobPosting) {
    this.jobForm.patchValue(job); 
    this.toggleModal(); 
  }

  saveJobPosting() {
    if (this.jobForm.valid) {
      const jobData: JobPosting = this.jobForm.value;
      if (jobData.id) { 
        this.jobService.updateJob(jobData.id, jobData).subscribe({
          next: () => {
            this.loadJobPostings(); 
            this.toggleModal(); 
            this.toastr.success('Job posting updated successfully!', 'Success'); 
          },
          error: (error) => {
            console.error('Error updating job posting:', error);
            this.toastr.error('Error updating job posting. Please try again later.', 'Error'); 
          }
        });
      } else { 
       
        this.createJobPosting(); 
      }
    }
  }
  
  removeJob(jobId: number): void {
    const title = 'Confirm Delete';
    const message = 'Are you sure you want to delete this job posting?';
  
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: title,
        message: message
      }
    });
  

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.jobService.deleteJob(jobId).subscribe({
          next: () => {
            this.loadJobPostings();
            this.toastr.success('Job posting removed successfully!', 'Success');
          },
          error: error => {
            console.error('Error removing job posting:', error);
            this.toastr.error('Error removing job posting. Please try again later.', 'Error');
          }
        });
      }
    });
  }
  
}
