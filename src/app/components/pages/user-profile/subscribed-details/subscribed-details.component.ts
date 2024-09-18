import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProductService } from 'src/app/shared/services/product.service';

export interface User {
  id: string;
  avatar: string;
}

export interface Company {
  id: string;
  company_name: string;
  user: User;
}

export interface Subscription {
  id: string;
  userId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  Company: Company;
  subscribedStatus: boolean
}


@Component({
  selector: 'app-subscribed-details',
  templateUrl: './subscribed-details.component.html',
  styleUrls: ['./subscribed-details.component.scss']
})
export class SubscribedDetailsComponent implements OnInit {

  params: any = {
    limit: 9,
    page: 1
  }
  loading:boolean=true;
  subscribedCompanyes: Subscription[] = [];
  total:number=0;

  constructor(private productService: ProductService ,private messageService:MessageService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(data => {
      this.params = data;
      this.getAllSubscribedCompany();
    })


  }
  getAllSubscribedCompany() {
    this.productService.getSubscribedCompany(this.params).subscribe({
      next: (response: any) => {
        this.loading=false;
        this.subscribedCompanyes = response.subscribtions;
        this.total=response.count;
        //need to add extra property for show and hide subscription
        this.subscribedCompanyes = this.subscribedCompanyes.map(data => {
          return { ...data, subscribedStatus: true };
        });
        console.log(response);
      }, error: (err) => {
        this.loading=false;
        console.log(err);
      }
    });
  }
  unSubscribe(companyId:string) {

    //this is for change status of subscriptionn
    this.subscribedCompanyes=this.changeSubscribedStatus(companyId,false);

    this.productService.unSubscribeCompany(companyId).subscribe({
      next:(response:any)=>{
        this.messageService.add({severity:'success',summary:'Success',detail:response.message})
      },error:(err)=>{
        this.messageService.add({severity:'error',summary:'Error',detail:err.error.message})
        this.subscribedCompanyes=this.changeSubscribedStatus(companyId,true);

      }
    })
  }
  subscribe(companyId:string){

    this.subscribedCompanyes=this.changeSubscribedStatus(companyId,true);

    this.productService.subscribeCompany(companyId).subscribe({
      next:(response:any)=>{
        this.messageService.add({severity:'success',summary:'Success',detail:response.message})
      },error:(err:any)=>{
        this.messageService.add({severity:'error',summary:'Error',detail:err.error.message})
        this.subscribedCompanyes=this.changeSubscribedStatus(companyId,false);
      }
    })
  }
  changeSubscribedStatus(companyId:string,status:boolean){
    return this.subscribedCompanyes.map(data=>{
      if(data.companyId==companyId){
        return {...data,subscribedStatus:status}
      }
      return data;
    })
  }
  viewMore(){
    
    this.router.navigate(['/profile/subscribed-listing'],{queryParams:{...this.params,limit:parseInt(this.params.limit)+9}})
  }

}
