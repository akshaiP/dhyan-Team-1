import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminJobService } from '../../service/admin-job.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-postings',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './job-posting.component.html',
  styleUrls: ['./job-posting.component.css']
})
export class JobPostingComponent implements OnInit {
  jobForm!: FormGroup; 
  jobPostings: any[] = [];
  showModal: boolean = false;

  constructor(private fb: FormBuilder, private jobService: AdminJobService) { }

  ngOnInit(): void {
    this.initializeForm(); // Initialize the form on component initialization
    this.loadJobPostings();
  }

  initializeForm() {
    this.jobForm = this.fb.group({
      id: [null],
      companyName: ['', Validators.required],
      companyLogoUrl: ['', Validators.required],
      location: ['', Validators.required],
      jobTitle: ['', Validators.required],
      jobDescription: ['', Validators.required],
      requirements: ['', Validators.required],
      lastDateToApply: ['', Validators.required],
      status: ['ACTIVE'] // Default status to ACTIVE on creation
    });
  }

  toggleModal() {
    this.showModal = !this.showModal;
    if (!this.showModal) {
      this.jobForm.reset(); // Clear form when modal is closed
      this.jobForm.patchValue({ status: 'ACTIVE' }); // Reset to default status
    }
  }

  createJobPosting() {
    if (this.jobForm.valid) {
      const jobData = this.jobForm.value;
      this.jobService.createJob(jobData).subscribe({
        next: () => {
          this.loadJobPostings(); // Reload job postings after creation
          this.toggleModal(); // Close modal after creating
        },
        error: (error) => {
          console.error('Error creating job posting:', error);
        }
      });
    }
  }

  loadJobPostings() {
    this.jobService.getJobs().subscribe({
      next: (response) => {
        this.jobPostings = response;
      },
      error: (error) => {
        console.error('Error loading job postings:', error);
      }
    });
  }

  editJob(job: any) {
    this.jobForm.patchValue(job); // Populate the form with job details
    this.toggleModal(); // Open modal for editing
  }

  saveJobPosting() {
    if (this.jobForm.valid) {
      const jobData = this.jobForm.value;
      if (jobData.id) { // If 'id' is present, update the existing job
        this.jobService.updateJob(jobData.id, jobData).subscribe({
          next: () => {
            this.loadJobPostings(); // Reload job postings after update
            this.toggleModal(); // Close modal after saving
          },
          error: (error) => {
            console.error('Error updating job posting:', error);
          }
        });
      } else { 
        // If 'id' is not present, create a new job
        this.createJobPosting(); // Call createJobPosting method
      }
    }
  }
  
  removeJob(jobId: number) {
    this.jobService.deleteJob(jobId).subscribe({
      next: () => {
        this.loadJobPostings(); // Refresh the job postings list
      },
      error: (error) => {
        console.error('Error removing job posting:', error);
      }
    });
  }
}
