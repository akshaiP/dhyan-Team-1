import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { JobPosting } from '../models/job-posting.model';
import { Application } from '../models/application.model';
import { AdminDashboard } from '../models/adminDashboard.model';

@Injectable({
  providedIn: 'root'
})
export class AdminJobService {
  
  private baseUrl = 'http://localhost:8080/api/admin'; 

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('angular18Token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

   // Fetch all job postings
   getJobs(): Observable<JobPosting[]> {
    return this.http.get<JobPosting[]>(`${this.baseUrl}/job-posting`, {
      headers: this.getAuthHeaders()
    });
  }

  // Create a new job posting
  createJob(job: JobPosting): Observable<JobPosting> {
    return this.http.post<JobPosting>(`${this.baseUrl}/job-posting`, job, {
      headers: this.getAuthHeaders()
    });
  }

  // Update an existing job posting
  updateJob(jobId: number, job: JobPosting): Observable<JobPosting> {
    return this.http.put<JobPosting>(`${this.baseUrl}/job-posting/${jobId}`, job, {
      headers: this.getAuthHeaders()
    });
  }

  // Delete a job posting
  deleteJob(jobId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/job-posting/${jobId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getApplicationsByJobId(jobId: string) {
    return this.http.get<any[]>(`http://localhost:8080/api/admin/applications/job/${jobId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserProfile(userProfileId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/user-profile/${userProfileId}` , {
      headers: this.getAuthHeaders()
    });
  }

  // Fetch all applications
  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/applications`, {
      headers: this.getAuthHeaders()
    });
  }

  updateApplicationStatus(applicationId: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/applications/${applicationId}/status`, null, {
      params: { status },
      headers: this.getAuthHeaders()
    });
}
  
  updateApplicationStage(applicationId: number, stage: string, stageStatus: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/applications/${applicationId}/stage`, null, {
      params: { newStage: stage, stageStatus: stageStatus },
      headers: this.getAuthHeaders()
    }).pipe(
        catchError(error => {
          if (error.status === 400) {
            
            alert(error.error.message || 'An error occurred while updating the stage');
          } else {
           
            alert('An unexpected error occurred');
          }
          return throwError(error);
        })
      );
  }

  // Revoke or delete a specific application
  revokeApplication(applicationId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/applications/${applicationId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Fetch dashboard stats
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard-stats`, {
      headers: this.getAuthHeaders()
    });
  }

  // Fetch companies data
  getCompanies(): Observable<any> {
    return this.http.get(`${this.baseUrl}/companies`, {
      headers: this.getAuthHeaders()
    });
  }

  getDashboardData(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(`${this.baseUrl}/dashboard`, {
      headers: this.getAuthHeaders()
    });
  }
}
