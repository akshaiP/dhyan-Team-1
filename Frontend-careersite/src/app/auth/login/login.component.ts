import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink, RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule, MatIconModule,
    MatInputModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginObj: any = {
    username: '',
    password: ''
  };

  hidePassword = true;

  private http = inject(HttpClient);
  private router = inject(Router);
  private toastr = inject(ToastrService); 
  onLogin() {
    this.http.post("http://localhost:8080/api/login", this.loginObj)
      .subscribe((res: any) => {
        if (res.token) {
          
          this.toastr.success(res.message, 'Login Success');
          localStorage.setItem('angular18Token', res.token);
          localStorage.setItem('userId', res.userId.toString());
          
          this.router.navigateByUrl(res.redirect === 'Admin Dashboard' ? 'admin-dashboard' : 'user-dashboard');
        } else {
          
          this.toastr.error(res.error || "Login failed", 'Login Error');
        }
      }, error => {
        
        this.toastr.error("An error occurred: " + error.message, 'Error');
      });
  }

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.hidePassword = !this.hidePassword;
  }
}
