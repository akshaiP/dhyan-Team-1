import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from "../AdminDashboard/dashboard.component";


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
