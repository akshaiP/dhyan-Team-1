import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterOutlet, Router,RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';


@Component({
  selector: 'app-layout',
  standalone:true,
  imports:[RouterOutlet,RouterLink,
    RouterLinkActive,
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatMenuModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  constructor(private router: Router) {}

  logout(): void {
    localStorage.clear(); 
    this.router.navigate(['/login']); // Redirect to login page
  }
}
