import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./auth/login/login.component";
import { DashboardComponent } from "./Admin/AdminDashboard/dashboard.component";
import { LayoutComponent } from "./Admin/AdminLayout/layout.component";
import { UserlayoutComponent } from './User/userlayout/userlayout.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, DashboardComponent, LayoutComponent, UserlayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Hire Me!';
}
