import { Component, NgModule, OnInit } from '@angular/core';
import { AdminJobService } from '../../service/admin-job.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports:[CommonModule,
    MatCardModule,
    MatIconModule
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  companiesCount: number = 0;
  applicationsCount: number = 0;
  usersCount: number = 0;
  jobPostingsCount: number = 0;
  companies: any[] = [];
  newApplicationsToday: number = 0;
  newCompaniesRegistered: number = 0;
  jobsPostedToday: number = 0;
  usersSuspended: number = 0;

  constructor(private adminJobService: AdminJobService) {}

  ngOnInit(): void {
    this.getDashboardStats();
    this.getCompanies();
  }

  getDashboardStats(): void {
    this.adminJobService.getDashboardStats().subscribe(
      data => {
        this.companiesCount = data.companiesCount;
        this.applicationsCount = data.applicationsCount;
        this.usersCount = data.usersCount;
        this.jobPostingsCount = data.jobPostingsCount;
        this.newApplicationsToday = data.newApplicationsToday;
        this.newCompaniesRegistered = data.newCompaniesRegistered;
        this.jobsPostedToday = data.jobsPostedToday;
        this.usersSuspended = data.usersSuspended;
      },
      error => {
        console.error('Error fetching dashboard stats:', error);
      }
    );
  }

  getCompanies(): void {
    this.adminJobService.getCompanies().subscribe(
      data => {
        this.companies = data;
      },
      error => {
        console.error('Error fetching companies:', error);
      }
    );
  }
}
