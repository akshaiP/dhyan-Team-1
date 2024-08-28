import { Component } from '@angular/core';
import { RouterOutlet,Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { UserdashboardComponent } from '../userdashboard/userdashboard.component';
import { JobService } from '../../service/job.service';


@Component({
  selector: 'app-userlayout',
  standalone: true,
  imports: [RouterOutlet, UserdashboardComponent,RouterModule],
  providers:[JobService],
  templateUrl: './userlayout.component.html',
  styleUrl: './userlayout.component.css'
})
export class UserlayoutComponent {
  
  constructor(private jobser: JobService, private router: Router) {}

  logout(): void {
    localStorage.clear();

    // Redirect to the login page
    this.router.navigate(['/login']);
  }
}

