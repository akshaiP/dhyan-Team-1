import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminJobService } from '../../service/admin-job.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import the necessary modules
import { JobPosting } from '../../models/job-posting.model';

@Component({
  selector: 'app-job-postings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // Include necessary modules
  templateUrl: './job-posting.component.html',
  styleUrls: ['./job-posting.component.css']
})
export class JobPostingComponent implements OnInit {
  jobForm!: FormGroup; 
  jobPostings: JobPosting[] = []; // Use the JobPosting interface
  showModal: boolean = false;

  constructor(private fb: FormBuilder, private jobService: AdminJobService) { }

  ngOnInit(): void {
    this.initializeForm(); // Initialize the form on component initialization
    this.loadJobPostings(); // Load job postings
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
      const jobData: JobPosting = this.jobForm.value;
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
      next: (response: JobPosting[]) => {
        this.jobPostings = response;
      },
      error: (error) => {
        console.error('Error loading job postings:', error);
      }
    });
  }

  editJob(job: JobPosting) {
    this.jobForm.patchValue(job); // Populate the form with job details
    this.toggleModal(); // Open modal for editing
  }

  saveJobPosting() {
    if (this.jobForm.valid) {
      const jobData: JobPosting = this.jobForm.value;
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