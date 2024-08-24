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
    // Call the logout method from the AuthService
    this.jobser.logout().subscribe(() => {
      // Redirect to the login page after successful logout
      this.router.navigate(['/login']);
    });
  }
}

