import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IProduct } from 'src/app/shared/models/product';
import { User, UserDetails } from 'src/app/shared/models/user';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  bigImageForShowing:string='';
  totalRating: number = 0;
  rate: number = 0

  btn = true
  paragraph: string = `Our premium cannabis dried flower is cultivated from top-quality strains, ensuring a potent and aromatic
                experience Our premium cannabis dried flower is cultivated from top-quality strains, ensuring `;
  charLimit: number = 100;
  showAll: boolean = false;

  product!: IProduct;
  productId!: string|null;
  loading:boolean=true;

  constructor(private productService: ProductService,private userService:UserService, private activatedRoute: ActivatedRoute, private router: Router,private tostr:ToastrService) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('id')) {
        this.productId = params.get('id');
        this.getSingleProduct();
        
      }
    });

  }
  addProductToWishlit(id:string){
    if(this.productId){
      this.productService.addProductToWishlist(id).subscribe({
        next:(response:any)=>{
          this.tostr.success(response.message);
        },
        error:(err)=>{
          console.log(err);
          this.tostr.error(err.error.error.message);
        }
      })
    }
  }
  getSingleProduct(){
    if(this.productId){
      this.productService.getProductById(this.productId).subscribe({
        next:(response:any)=>{
          this.product=response.product;

          this.bigImageForShowing=this.product.images[0];
          this.totalRating=this.product.rating;

          this.loading=false;
          console.log(response);
        },error:(err)=>{
          console.log(err);
          this.loading=false;
        }
      })
    }
  }

  showBigImageWhenClick(url:string){
    this.bigImageForShowing=url;
  }

  toggleBtn() {
    this.btn = !this.btn
  }

  toggleViewMore() {
    this.showAll = !this.showAll;
  }

  giveRatingToProduct(){
    if(this.productId){
      this.productService.rateProduct(this.productId,{rating:this.rate}).subscribe({
        next:(response:any)=>{
          this.tostr.success(response.message);
          this.getSingleProduct();
        },error:(err:any)=>{
          console.log(err);
        }
      })
    }
  }

}
