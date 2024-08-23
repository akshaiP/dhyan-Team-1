import { Component,OnInit, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-userdashboard',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './userdashboard.component.html',
  styleUrl: './userdashboard.component.css'
})
export class UserdashboardComponent implements OnInit{
  http=inject(HttpClient);
  userList:any[]=[];
  ngOnInit(): void {
    this.getAllUser();
  }
  getAllUser()
  {
    this.http.get("http://localhost:8080/api/login/users").subscribe((Res:any)=>{
      this.userList=Res;
    })
  }
}
