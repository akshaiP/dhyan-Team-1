import { Component, inject, ViewChild, ChangeDetectionStrategy, signal, ChangeDetectorRef } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr'; 

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
  passwordsMatch: boolean = true; 

  @ViewChild('usernameField') usernameField!: NgModel;
  @ViewChild('emailField') emailField!: NgModel;
  @ViewChild('passwordField') passwordField!: NgModel;
  @ViewChild('confirmPasswordField') confirmPasswordField!: NgModel;
  @ViewChild('phoneNumberField') phoneNumberField!: NgModel;

  private http = inject(HttpClient);
  private router = inject(Router);
  private toastr = inject(ToastrService); 

  readonly email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');

  constructor(private cdr: ChangeDetectorRef) {
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

  checkPasswordsMatch() {  
    this.passwordsMatch = this.password === this.confirmPassword;
    this.cdr.detectChanges();
  }

  onRegister(signupForm: NgForm) {
    if (signupForm.valid) {
      const userData = {
        username: this.username,
        email: this.email.value, 
        password: this.password,
        phoneNumber: this.phoneNumber
      };

      this.http.post('http://localhost:8080/api/signup', userData, { responseType: 'text' })
        .subscribe({
          next: (res: string) => {
            if (res === "User registered successfully") {
              this.toastr.success('Registration Successful', 'Success'); 
              this.router.navigateByUrl('login').then(navigated => {
                console.log('Navigation successful:', navigated);
              }).catch(err => {
                console.error('Navigation error:', err);
              });
            } else {
              this.toastr.error(res, 'Error'); 
            }
          },
          error: (err: any) => {
            const errorMessage = err.error ? err.error : 'An error occurred. Please try again.';
            console.error('Error during registration:', err);
            this.toastr.error(errorMessage, 'Error');
          }
        });
    }
  }
}
