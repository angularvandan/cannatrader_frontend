import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit{

  content={
    title:'',
    desc:''
  }
  loading:boolean=true;

  constructor(private userService:UserService){}
  ngOnInit(): void {
      this.userService.privacyAndTerms({title:'PRIVACY_POLICY'}).subscribe({
        next:(response:any)=>{
          this.content.title=response.content.title;
          this.content.desc=response.content.desc;
          // console.log(response);
          this.loading=false;
        },error:(err)=>{
          console.log(err);
          this.loading=false;
        }
      })
  }
}
