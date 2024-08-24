import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiEndpoint: string = 'http://localhost:8080/api/';  // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  // Get the list of active jobs
  GetActiveJobs(): Observable<any> {
    return this.http.get<any>(`${this.apiEndpoint}GetActiveJobListing`);
  }

  // Get job details by job ID
  GetJobListingById(jobId: number): Observable<any> {
    return this.http.get<any>(`${this.apiEndpoint}GetJobListingById?Id=${jobId}`);
  }

  // Apply for a job
  ApplyForJob(jobId: number): Observable<any> {
    return this.http.post<any>(`${this.apiEndpoint}ApplyForJob`, { jobId: jobId });
  }

   // Get all favorite jobs
   GetFavoriteJobs(): Observable<any> {
    return this.http.get<any>(this.apiEndpoint + 'GetFavoriteJobs');
  }

  // Mark a job as favorite
  MarkAsFavorite(jobId: number): Observable<any> {
    return this.http.post<any>(`${this.apiEndpoint}MarkAsFavorite`, { jobId: jobId });
  }

  // Remove a job from favorites
  RemoveFromFavorites(jobId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}RemoveFromFavorites/${jobId}`);
  }
}
