import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LayoutComponent } from './Admin/AdminLayout/layout.component';
import { DashboardComponent } from './Admin/AdminDashboard/dashboard.component';
import { ApplicationsComponent } from './Admin/applications/applications.component';
import { JobPostingComponent } from './Admin/job-posting/job-posting.component';
import { UserlayoutComponent } from './User/userlayout/userlayout.component';
import { UserdashboardComponent } from './User/userdashboard/userdashboard.component';
import { ApplicationStatusComponent } from './User/applicationstatus/applicationstatus.component';
import { FavoriteJobsComponent } from './User/favouritejobs/favouritejobs.component';
import { JoblistComponent } from './User/joblist/joblist.component';
import { canActivateGuard } from './guard/canactivate.guard';
import { UpdateApplicationComponent } from './Admin/update-application/update-application.component';
import { UserProfileComponent } from './User/user-profile/user-profile.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent 
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [canActivateGuard],
    children: [
      {
        path: 'admin-dashboard',
        component: DashboardComponent
      },
      {
        path: 'applications',
        component: ApplicationsComponent
      },
      {
        path: 'job-posting',
        component: JobPostingComponent
      },
      { 
        path: 'updateapplication/:id', 
        component: UpdateApplicationComponent 
      }

    ]
  },
  {
    path: '',
    component: UserlayoutComponent,
    canActivate: [canActivateGuard],
    children: [
      {
        path: 'user-dashboard',
        component: UserdashboardComponent
      },
      {
        path: 'application-status',
        component: ApplicationStatusComponent
      },
     
      {
        path: 'job-list',
        component: JoblistComponent
      },
      {
        path: 'favorite-jobs',
        component: FavoriteJobsComponent
      },
      {
        path: 'user-profile',  
        component: UserProfileComponent
      }
    ]
  }
];
