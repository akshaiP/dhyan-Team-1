import { Component, NgModule, OnInit } from '@angular/core';
import { JobService } from '../../service/job.service';
import { CommonModule} from '@angular/common';

@Component({
  selector: 'app-favoritejobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favouritejobs.component.html',
  styleUrls: ['./favouritejobs.component.css'],
  
  providers:[JobService]
})
export class FavoriteJobsComponent implements OnInit {
  favoriteJobs: any[] = [];

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadFavoriteJobs();
  }

  loadFavoriteJobs(): void {
    this.jobService.GetFavoriteJobs().subscribe((res: any) => {
      this.favoriteJobs = res.map((item: any) => item.jobPosting); 
    });
  }

  removeFromFavorites(jobId: number): void {
    this.jobService.RemoveFromFavorites(jobId).subscribe(() => {
      alert('Job removed from favorites!');
      this.loadFavoriteJobs(); // Refresh the list
    });
  }

  truncateText(text: string, limit: number): string {
    return text.length > limit ? text.slice(0, limit) + '...' : text;
  }
}
