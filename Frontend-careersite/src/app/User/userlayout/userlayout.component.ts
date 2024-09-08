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
import { MatBadgeModule } from '@angular/material/badge';
import { formatDistanceToNow } from 'date-fns';

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
    MatBadgeModule,
    MatSidenav,
    CommonModule
  ],
  providers: [JobService],
  templateUrl: './userlayout.component.html',
  styleUrls: ['./userlayout.component.scss'],

})
export class UserlayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('notificationPanel') notificationPanel!: MatSidenav;
  
  isExpanded: boolean = true;
  isSidenavOpened: boolean = true;
  isNotificationPanelOpened: boolean = false;
  unreadCount: number = 0;
  notifications: any[] = [];

  constructor(private router: Router , private jobService: JobService) {}

  ngOnInit() {
    this.loadNotifications(); 
  }

  // Logout function
  logout(): void {
    localStorage.clear(); 
    this.router.navigate(['/login']); 
  }

  // Fetch notifications and update the unread count
  loadNotifications() {
    const userId = Number(localStorage.getItem('userId'));
    this.jobService.getUnreadNotifications(userId).subscribe(data => {
      this.notifications = data.map((n: any) => ({
        ...n,
        timeAgo: formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) 
      }));
      this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    });
  }

  // Mark a notification as read
  markAsRead(notificationId: number) {
    this.jobService.markNotificationAsRead(notificationId).subscribe(() => {
      this.notifications = this.notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    });
  }

  // Toggle sidenav visibility
  toggleSidenav() {
    this.isSidenavOpened = !this.isSidenavOpened;
  }

  // Toggle notification panel visibility
  toggleNotificationPanel() {
    this.isNotificationPanelOpened = !this.isNotificationPanelOpened;
  }
}
