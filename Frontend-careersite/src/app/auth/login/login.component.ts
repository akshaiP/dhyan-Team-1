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
    MatFormFieldModule,MatIconModule,
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

  onLogin() {
    this.http.post("http://localhost:8080/api/login", this.loginObj)
      .subscribe((res: any) => {
        if (res.token) {
          alert(res.message);
          localStorage.setItem('angular18Token', res.token);
          localStorage.setItem('userId', res.userId.toString());
          this.router.navigateByUrl(res.redirect === 'Admin Dashboard' ? 'admin-dashboard' : 'user-dashboard');
        } else {
          alert(res.error || "Login failed");
        }
      }, error => {
        alert("An error occurred: " + error.message);
      });
  }

  togglePasswordVisibility(event: MouseEvent) {
    // Prevent the default action and stop the event from bubbling up
    event.preventDefault();
    event.stopPropagation();

    // Toggle the visibility of the password
    this.hidePassword = !this.hidePassword;
  }
}
