import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product';
import { UserService } from 'src/app/shared/services/user.service';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { Router } from '@angular/router';



@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
  providers: [ConfirmationService, MessageService]

})
export class ProfileDetailsComponent implements OnInit{

  products: Product[] = [
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },

  ];

  btn:any[]= [
    true,true,true
  ];

  constructor(private router:Router, private userService:UserService,private confirmationService: ConfirmationService, private messageService: MessageService){}
  ngOnInit(): void {
      
  }
  confirm1() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the product details?',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        this.userService.isLogin(false);
        this.router.navigate(['/login']);
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }

  onLogout(){
    this.confirm1();
  }

  toggleBtn(index:number) {
    this.btn[index] = !this.btn[index]
  }
}
