import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from 'src/app/shared/models/product';
import { User, UserDetails } from 'src/app/shared/models/user';
import { ProductService } from 'src/app/shared/services/product.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  bigImageForShowing: string = '';
  totalRating: number = 0;
  rate: number = 0;
  userId: string = '';
  showPhoneNoStatus: boolean = false;

  paragraph: string = `Our premium cannabis dried flower is cultivated from top-quality strains, ensuring a potent and aromatic
                experience Our premium cannabis dried flower is cultivated from top-quality strains, ensuring `;
  charLimit: number = 100;
  showAll: boolean = false;

  product!: IProduct;
  productId!: string | null;
  loading: boolean = true;
  isWishlisted: boolean = false;
  isSubscribed: boolean = false;



  constructor(private productService: ProductService, private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router, private tostr: ToastrService, private socketService: SocketService) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('id')) {
        this.productId = params.get('id');
        console.log(this.userService.currentUser);

        if (this.userService.currentUser.user) {
          this.userId = this.userService.currentUser?.user.id;
        }
        this.getSingleProduct();
      }
    });

  }
  get isAuth() {
    if (this.userService.currentUser.token) {
      return false;
    }
    return true;
  }

  addProductToWishlit(id: string) {
    if (this.productId && !this.isWishlisted) {
      this.isWishlisted = true;
      this.productService.addProductToWishlist(id).subscribe({
        next: (response: any) => {
          this.tostr.success(response.message);
        },
        error: (err) => {
          console.log(err);
          this.isWishlisted = false;

        }
      })
    }
    else {
      if (this.isWishlisted) {
        this.isWishlisted = false;
        this.productService.removeProductFromWishlist(id).subscribe({
          next: (response: any) => {
            this.tostr.success(response.message);
          }, error: (err) => {
            console.log(err);
            this.isWishlisted = true;

          }
        })
      }
    }
  }
  getSingleProduct() {
    if (this.productId) {
      this.productService.getProductById(this.productId, this.userId).subscribe({
        next: (response: any) => {
          this.product = response.product;

          this.bigImageForShowing = this.product.images[0];
          this.totalRating = this.product.rating;
          this.rate = this.product?.myRating || 0;
          this.isWishlisted = this.product.isWishlisted || false;
          this.isSubscribed = this.product.vendor?.company.subscribed || false;

          this.loading = false;
          console.log(response);
        }, error: (err) => {
          console.log(err);
          this.loading = false;
        }
      })
    }
  }

  showBigImageWhenClick(url: string) {
    this.bigImageForShowing = url;
  }

  subscribeCompany(companyId: string) {
    if (companyId != '') {
      console.log(companyId);
      if (!this.isSubscribed) {
        this.isSubscribed = true;
        this.productService.subscribeCompany(companyId).subscribe({
          next: (response: any) => {
            this.tostr.success(response.message);
          }, error: (err) => {
            console.log(err);
            this.isSubscribed = false;
          }
        })
      }
      else {
        console.log(companyId);
        this.isSubscribed = false;
        this.productService.unSubscribeCompany(companyId).subscribe({
          next: (response: any) => {
            this.tostr.success(response.message);
          }, error: (err) => {
            console.log(err);
            this.isSubscribed = true;
          }
        })
      }
    }
  }

  toggleViewMore() {
    this.showAll = !this.showAll;
  }

  giveRatingToProduct() {
    if (this.productId) {
      this.productService.rateProduct(this.productId, { rating: this.rate }).subscribe({
        next: (response: any) => {
          this.tostr.success(response.message);
          this.getSingleProduct();
        }, error: (err: any) => {
          console.log(err);
          this.rate = 0;
        }
      })
    }
  }

  nevigateToChat(userId: string) {
    console.log(userId);
    if (this.userId.trim()) {
      this.productService.startChat(userId).subscribe({
        next:(response:any)=>{
          console.log(response.data.id);
          this.socketService.emit('joinChat',response.data.id);
        },error:(err)=>{
          console.log(err);
        }
      });
    }
    this.router.navigate(['/products/chats']);
  }

}
