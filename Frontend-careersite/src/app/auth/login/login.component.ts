import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {

  loginObj: any = {
    "username": "",
    "password": ""
  };

  
  private http = inject(HttpClient);
  private router = inject(Router);

  onLogin() {
    this.http.post("http://localhost:8080/api/login", this.loginObj)
      .subscribe((res: any) => {
        if (res.token) {
          alert(res.message);
          localStorage.setItem('angular18Token', res.token);
          this.router.navigateByUrl(res.redirect === 'Admin Dashboard' ? 'admin-dashboard' : 'user-dashboard');
        } else {
          alert(res.error || "Login failed");
        }
      }, error => {
        alert("An error occurred: " + error.message);
      });
  }
}
