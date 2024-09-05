import { Component } from '@angular/core';
import { RouterOutlet, Router,RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserdashboardComponent } from '../userdashboard/userdashboard.component';
import { JobService } from '../../service/job.service';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-userlayout',
  standalone: true,
  imports: [
    RouterOutlet,RouterLink,
    RouterLinkActive,
    UserdashboardComponent, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule
  ],
  providers: [JobService],
  templateUrl: './userlayout.component.html',
  styleUrls: ['./userlayout.component.scss']
})
export class UserlayoutComponent {
  
  constructor(private jobser: JobService, private router: Router) {}

  logout(): void {
    localStorage.clear();

    // Redirect to the login page
    this.router.navigate(['/login']);
  }
}

