import { AfterViewInit, Component, NgModule, OnInit } from '@angular/core';
import { AdminJobService } from '../../service/admin-job.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { ToastrService } from 'ngx-toastr'; 
import * as Highcharts from 'highcharts';
import { AdminDashboard } from '../../models/adminDashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  counts = {
    companiesCount: 0,
    jobPostingsCount: 0,
    totalApplications: 0,
    activeUsers: 0
  };
  startCounts = {
    startCompaniesCount: 0,
    startJobPostingsCount: 0,
    startTotalApplications: 0,
    startActiveUsers: 0
  };
  jobTitleApplications: Record<string, number> = {};
  statusCounts: Record<string, number> = {};

  constructor(private adminJobService: AdminJobService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  animateCount(propertyName: keyof typeof this.startCounts, targetCount: number, interval: number): void {
    const intervalId = setInterval(() => {
      this.startCounts[propertyName]++;
      if (this.startCounts[propertyName] >= targetCount) {
        clearInterval(intervalId);
      }
    }, interval);
  }

  startCountingAnimations(): void {
    this.animateCount('startCompaniesCount', this.counts.companiesCount, 100);
    this.animateCount('startJobPostingsCount', this.counts.jobPostingsCount, 100);
    this.animateCount('startTotalApplications', this.counts.totalApplications, 100);
    this.animateCount('startActiveUsers', this.counts.activeUsers, 100);
  }
  
  loadDashboardData(): void {
    this.adminJobService.getDashboardData().subscribe(
      (data: AdminDashboard) => {
        this.counts.companiesCount = data.companiesCount;
        this.counts.jobPostingsCount = data.jobPostingsCount;
        this.counts.totalApplications = data.totalApplications;
        this.counts.activeUsers = data.activeUsersCount;
        this.jobTitleApplications = data.jobTitleApplications;
        this.statusCounts = data.statusCounts;

        this.startCountingAnimations();
        this.initializeCharts();
      },
      (error: any) => {
        console.error('Error fetching dashboard data:', error);
        this.toastr.error('Error fetching dashboard data. Please try again later.', 'Error');
      }
    );
  }

  initializeCharts(): void {
    this.initializePieChart(this.statusCounts);
    this.initializeBarChart(this.jobTitleApplications);
  }

  initializePieChart(statusCounts: Record<string, number>): void {
    Highcharts.chart('highchart-pie', {
      chart: { type: 'pie' },
      title: { text: 'Application Status Distribution' },
      credits: {
        enabled:false
      },
      series: [{
        type: 'pie',
        name: 'Applications',
        colorByPoint: true,
        data: Object.keys(statusCounts).map(status => ({
          name: status,
          y: statusCounts[status],
          color: this.getColorForStatus(status)
        }))
      } as Highcharts.SeriesPieOptions]
    });
  }

  initializeBarChart(jobTitleApplications: Record<string, number>): void {
    Highcharts.chart('highchart-bar', {
      chart: { type: 'column' },
      title: { text: 'Top Applications by Job Title' },
      xAxis: { type: 'category' },
      yAxis: { title: { text: 'Total Applications' } },
      credits: {
        enabled:false
      },
      series: [{
        type: 'column',
        name: 'Applications',
        data: Object.keys(jobTitleApplications).map(title => [title, jobTitleApplications[title]])
      } as Highcharts.SeriesColumnOptions]
    });
  }

  getColorForStatus(status: string): string {
    switch (status) {
      case 'PENDING': return '#FF9655';
      case 'ACCEPTED': return '#64E572';
      case 'REJECTED': return '#FF0000';
      default: return '#FFFFFF';
    }
  }
}
