import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent implements OnInit{

  content={
    title:'',
    desc:''
  }
  loading:boolean=true;

  constructor(private userService:UserService){}
  ngOnInit(): void {
      this.userService.privacyAndTerms({title:'TERMS_AND_CONDITIONS'}).subscribe({
        next:(response:any)=>{
          this.content.title=response.content.title;
          this.content.desc=response.content.desc;
          this.loading=false;
          // console.log(response);
        },error:(err)=>{
          console.log(err);
          this.loading=false;
        }
      })
  }
}
