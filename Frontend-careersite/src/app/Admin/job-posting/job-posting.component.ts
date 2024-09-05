import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminJobService } from '../../service/admin-job.service';
import { CommonModule } from '@angular/common';
import { MatCardModule} from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { JobPosting } from '../../models/job-posting.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-job-postings',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,MatDialogModule,MatCardModule,MatIconModule,
    MatFormFieldModule,
    MatInputModule,MatSelectModule,
    MatButtonModule,],
  templateUrl: './job-posting.component.html',
  styleUrls: ['./job-posting.component.scss']
})
export class JobPostingComponent implements OnInit {
  jobForm!: FormGroup; 
  jobPostings: JobPosting[] = []; 
  showModal: boolean = false;

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
  
  removeJob(jobId: number) {
    this.jobService.deleteJob(jobId).subscribe({
      next: () => {
        this.loadJobPostings(); 
        this.toastr.success('Job posting removed successfully!', 'Success'); 
      },
      error: (error) => {
        console.error('Error removing job posting:', error);
        this.toastr.error('Error removing job posting. Please try again later.', 'Error'); 
      }
    });
  }
}
