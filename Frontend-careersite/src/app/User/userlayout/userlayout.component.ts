import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserdashboardComponent } from '../userdashboard/userdashboard.component';

@Component({
  selector: 'app-userlayout',
  standalone: true,
  imports: [RouterOutlet, UserdashboardComponent],
  templateUrl: './userlayout.component.html',
  styleUrl: './userlayout.component.css'
})
export class UserlayoutComponent {

}
