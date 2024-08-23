import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';  
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule]  
})
export class RegisterComponent {

  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  phoneNumber: string = '';

  private http = inject(HttpClient);
  private router = inject(Router);

  onRegister(signupForm: NgForm) {
    if (signupForm.valid) {
      const userData = {
        username: this.username,
        email: this.email,
        password: this.password,
        phoneNumber: this.phoneNumber,
      };

      this.http.post('http://localhost:8080/api/signup', userData, { responseType: 'text' })
        .subscribe({
          next: (res: string) => {
            if (res === "User registered successfully") {
              alert('Registration Successful');
              this.router.navigateByUrl('login').then(navigated => {
                console.log('Navigation successful:', navigated);
              }).catch(err => {
                console.error('Navigation error:', err);
              });
            } else {
              alert(res);
            }
          },
          error: (err: any) => {
            console.error('Error during registration:', err);
            alert('An error occurred. Please try again.');
          }
        });
    }
  }
}
