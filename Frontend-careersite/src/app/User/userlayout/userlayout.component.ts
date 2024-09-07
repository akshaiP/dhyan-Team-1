import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterLinkActive } from '@angular/router';
import { JobService } from '../../service/job.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-userlayout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatSidenav,
    CommonModule
  ],
  providers: [JobService],
  templateUrl: './userlayout.component.html',
  styleUrls: ['./userlayout.component.scss']
})
export class UserlayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isExpanded: boolean = true; // Controls sidenav expansion state

  isSidenavOpened: boolean = true; // Initially, the sidenav is open

  constructor(private router: Router) {}

  // Function to toggle the sidenav visibility
  toggleSidenav() {
    this.isSidenavOpened = !this.isSidenavOpened;
  }

  // Logout function
  logout(): void {
    localStorage.clear(); // Clear user session
    this.router.navigate(['/login']); // Redirect to login page
  }
}
