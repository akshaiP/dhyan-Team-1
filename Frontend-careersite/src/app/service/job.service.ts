import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  apiEndpoint:string='http://localhost:8080/api/'    //replace backend api 

  constructor(private http:HttpClient) { }




GetActiveJobs()
{
  return this.http.get(this.apiEndpoint+'GetActiveJobListing')  //api for getting joblist

}

}
