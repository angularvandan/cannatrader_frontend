import { Component, OnInit } from '@angular/core';
import { IProduct, Product } from 'src/app/shared/models/product';
import { UserService } from 'src/app/shared/services/user.service';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { Router } from '@angular/router';
import { UserDetails } from 'src/app/shared/models/user';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/shared/services/product.service';



@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
  providers: [ConfirmationService, MessageService]

})
export class ProfileDetailsComponent implements OnInit {

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
  products1: IProduct[] = [];

  user: UserDetails = {
    avatar: '',
    email: '',
    id: '',
    is_company: false,
    name: '',
    phone_no: '',
    role: '',
    is_verified: false
  };

  btn: any[] = [
    true, true, true
  ];

  loadingUserImage:boolean=true;
  recentProductStatus:boolean=false;


  constructor(private router: Router, private tostr: ToastrService, private userService: UserService, private confirmationService: ConfirmationService, private messageService: MessageService,private productService:ProductService) { }

  ngOnInit(): void {
    this.loadingUserImage=true;
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        this.loadingUserImage=false;
        this.user = response.user;
        console.log(this.user);
      }, error: (err) => {
        console.log(err);
        this.loadingUserImage=false;
      }
    });
    //for recent listing products
    this.productService.getRecentListingProducts({limit:3,page:1}).subscribe({
      next:(response:any)=>{
        
        //for newest
        console.log(response.products);
        this.products1=response.products.sort((a:any, b:any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        this.recentProductStatus=true;

        console.log(this.products1);

      },error:(err)=>{
        this.recentProductStatus=false;
      }
    })
  }
  confirm1() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to logout?',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        this.router.navigate(['/home']);
        this.userService.logOut();
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }

  onLogout() {
    this.confirm1();
  }
  removeUserAccount() {
    this.confirmForRemoveAccount();
  }
  confirmForRemoveAccount() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete Account ?',
      accept: () => {
        
        this.userService.deleteUserAccount().subscribe({
          next: (response) => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
            this.router.navigate(['/home']);
            this.userService.logOut();
          },
          error: (err) => {
            this.tostr.error(err.error.error.message);
          }
        })
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }


  toggleBtn(index: number) {
    this.btn[index] = !this.btn[index]
  }

}
