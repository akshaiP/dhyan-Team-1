import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LayoutComponent } from './Admin/AdminLayout/layout.component';
import { DashboardComponent } from './Admin/AdminDashboard/dashboard.component';
import { ApplicationsComponent } from './Admin/applications/applications.component';
import { JobPostingComponent } from './Admin/job-posting/job-posting.component';
import { UserlayoutComponent } from './User/userlayout/userlayout.component';
import { UserdashboardComponent } from './User/userdashboard/userdashboard.component';
import { ApplicationstatusComponent } from './User/applicationstatus/applicationstatus.component';
import { FavouritejobsComponent } from './User/favouritejobs/favouritejobs.component';
import { JoblistComponent } from './User/joblist/joblist.component';
import { canActivateGuard } from './guard/canactivate.guard';
import { JobDetailComponent } from './User/job-detail/job-detail.component';


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
        component: ApplicationstatusComponent
      },
      {
        path: 'favorite-jobs',
        component: FavouritejobsComponent
      },
      {
        path: 'job-list',
        component: JoblistComponent
      },
      {
        path:'job-detail/:jobid',
        component:JobDetailComponent
      }
    ]
  }
];
