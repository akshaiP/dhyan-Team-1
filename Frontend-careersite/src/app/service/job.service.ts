import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiEndpoint: string = 'http://localhost:8080/api/user/';  

  constructor(private http: HttpClient) {}

  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('angular18Token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  GetUserApplicationStatus(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiEndpoint}application-status?userId=${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get the list of active jobs
  GetActiveJobs(): Observable<any> {
    return this.http.get<any>(`${this.apiEndpoint}jobs`, {
      headers: this.getAuthHeaders()
    });
  }
  
  GetUserApplications(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiEndpoint}applications?userId=${userId}`, {
      headers: this.getAuthHeaders()
    });
  }
  // Apply for a job
  ApplyForJob(request: { jobId: number; userId: number}): Observable<any> {
    return this.http.post<any>(`${this.apiEndpoint}apply`, request, {
      headers: this.getAuthHeaders()
    });
  }

  UnapplyForJob(request: { jobId: number; userId: number}): Observable<any> {
    return this.http.delete<any>(`${this.apiEndpoint}apply`, {
      headers: this.getAuthHeaders(),
      body: request
    });
  }

  GetFavoriteJobs(): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.get<any>(`${this.apiEndpoint}favorite?userId=${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Mark a job as favorite
  MarkAsFavorite(jobId: number): Observable<any> {
    const userId = localStorage.getItem('userId');
    console.log('Marking as favorite with userId:', userId, 'and jobId:', jobId);
    return this.http.post<any>(`${this.apiEndpoint}favorite?userId=${userId}&jobId=${jobId}`, null, {
      headers: this.getAuthHeaders()
    });
  }
  
  // Remove a job from favorites
  RemoveFromFavorites(jobId: number): Observable<any> {
    const userId = localStorage.getItem('userId');
    return this.http.delete<void>(`${this.apiEndpoint}favorite?userId=${userId}&jobId=${jobId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserProfile(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiEndpoint}profile?userId=${userId}` , {
      headers: this.getAuthHeaders()
    });
  }

  createOrUpdateProfile(profile: any): Observable<any> {
    return this.http.post<any>(`${this.apiEndpoint}profile`, profile, {
      headers: this.getAuthHeaders()
    });
  }

  // Fetch unread notifications for a specific user
  getUnreadNotifications(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiEndpoint}notifications?userId=${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Mark a notification as read
  markNotificationAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiEndpoint}notifications/${notificationId}/read`, {
      headers: this.getAuthHeaders()
    });
  }
}