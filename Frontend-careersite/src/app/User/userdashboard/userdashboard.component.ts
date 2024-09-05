import { Component } from '@angular/core';
import { UserlayoutComponent } from '../userlayout/userlayout.component';
import { JoblistComponent } from '../joblist/joblist.component';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.scss'],
  standalone: true,
  imports: [UserlayoutComponent, JoblistComponent]  
})
export class UserdashboardComponent {}
