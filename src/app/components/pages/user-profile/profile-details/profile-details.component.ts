import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product';
import { UserService } from 'src/app/shared/services/user.service';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDetails } from 'src/app/shared/models/user';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
  providers: [ConfirmationService, MessageService]

})
export class ProfileDetailsComponent implements OnInit {

  products: IProduct[] = [];

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

  params: any = {
    page: 1,
    limit: 4,
  }
  subscribedCompanyes: Subscription[] = []

  loadingUserImage: boolean = true;
  recentProductStatus: boolean = false;
  subscribedStatus: boolean = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private tostr: ToastrService, private userService: UserService, private confirmationService: ConfirmationService, private messageService: MessageService, private productService: ProductService) { }

  ngOnInit(): void {

    this.loadingUserImage = true;
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        this.loadingUserImage = false;
        this.user = response.user;
        // console.log(this.user);
      }, error: (err) => {
        this.tostr.error(err.error.message);
        this.loadingUserImage = false;
      }
    });
    //for recent listing products
    this.productService.getRecentListingProducts({ limit: 3, page: 1 }).subscribe({
      next: (response: any) => {
        //for newest
        // console.log(response.products);
        this.products = response.products.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        this.recentProductStatus = true;
        // console.log(this.products);
      }, error: (err: any) => {
        console.log(err);
        // this.tostr.error(err.error.error.message);
        this.recentProductStatus = true;
      }
    });
    this.getSubscribedCompany();
  }

  getSubscribedCompany() {
    this.productService.getSubscribedCompany(this.params).subscribe({
      next: (response: any) => {
        this.subscribedCompanyes = response.subscribtions;
        console.log(response);

        //need to add extra property for show and hide subscription
        this.subscribedCompanyes = this.subscribedCompanyes.map(data => {
          return { ...data, subscribedStatus: true };
        })
        this.subscribedStatus = false;
        console.log(this.subscribedCompanyes);
      }, error: (err) => {
        this.tostr.error(err.error.error.message);
        this.subscribedStatus = false;
      }
    })
  }
  confirm1() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to logout?',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
        setTimeout(() => {
          this.router.navigate(['/home']);
          this.userService.logOut();
        }, 1000);
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
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: response.message });
          },
          error: (err) => {
            this.tostr.error(err.error.error.message);
          }, complete: () => {
            this.userService.logOut();
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

  unSubscribe(companyId: string) {

    //this is for change status of subscriptionn
    this.subscribedCompanyes = this.changeSubscribedStatus(companyId, false);

    this.productService.unSubscribeCompany(companyId).subscribe({
      next: (response: any) => {
        this.tostr.success(response.message);
      }, error: (err) => {
        this.tostr.error(err.error.message);
        this.subscribedCompanyes = this.changeSubscribedStatus(companyId, true);

      }
    })
  }
  subscribe(companyId: string) {

    this.subscribedCompanyes = this.changeSubscribedStatus(companyId, true);

    this.productService.subscribeCompany(companyId).subscribe({
      next: (response: any) => {
        this.tostr.success(response.message);
      }, error: (err: any) => {
        this.tostr.error(err.error.message);
        this.subscribedCompanyes = this.changeSubscribedStatus(companyId, false);

      }
    })
  }
  changeSubscribedStatus(companyId: string, status: boolean) {
    return this.subscribedCompanyes.map(data => {
      if (data.companyId == companyId) {
        return { ...data, subscribedStatus: status }
      }
      return data;
    })
  }

}
