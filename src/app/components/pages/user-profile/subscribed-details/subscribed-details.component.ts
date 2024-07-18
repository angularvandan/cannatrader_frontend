import { Component } from '@angular/core';

@Component({
  selector: 'app-subscribed-details',
  templateUrl: './subscribed-details.component.html',
  styleUrls: ['./subscribed-details.component.scss']
})
export class SubscribedDetailsComponent {


  btn:any[]= [
    true,true,true,true,true
  ];
  constructor(){}

  toggleBtn(index:number) {
    this.btn[index] = !this.btn[index]
  }

}
