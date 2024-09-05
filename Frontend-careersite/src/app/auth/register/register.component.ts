import { Component, inject, ViewChild, ChangeDetectionStrategy, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, FormControl, NgForm, NgModel, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule, NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  phoneNumber: string = '';
  
  @ViewChild('usernameField') usernameField!: NgModel;
  @ViewChild('emailField') emailField!: NgModel;
  @ViewChild('passwordField') passwordField!: NgModel;
  @ViewChild('confirmPasswordField') confirmPasswordField!: NgModel;
  @ViewChild('phoneNumberField') phoneNumberField!: NgModel;

  private http = inject(HttpClient);
  private router = inject(Router);

  readonly email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');

  constructor() {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  onRegister(signupForm: NgForm) {
    if (signupForm.valid) {
      const userData = {
        username: this.username,
        email: this.email.value, // Adjusted to use value
        password: this.password,
        phoneNumber: this.phoneNumber
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
