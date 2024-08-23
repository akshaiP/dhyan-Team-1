import { Component,OnInit } from '@angular/core';
import { JobService } from '../../service/job.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-joblist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './joblist.component.html',
  styleUrl: './joblist.component.css'
})
export class JoblistComponent {

  jobList:any []=[];
  constructor(private jobSer:JobService){

  }
  ngOnInit():void{
    this.loadJobs();
  }  

  loadJobs()
  {
    this.jobSer.GetActiveJobs().subscribe((res:any)=>{
      this.jobList=res.data;
    })
  }

}
