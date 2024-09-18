import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';

export interface Category {
  id: string;
  name: string;
}

export interface StrainType {
  id: string;
  type: string;
}

export interface SubCategory {
  id: string;
  name: string;
}
export interface ThcRange {
  id: string;
  range: string;
}


export interface WishlitProduct {
  id: string;
  name: string;
  distance: number;
  images: string[];
  strain_type: StrainType;
  sub_category: SubCategory;
  thc_range: ThcRange; // Assuming thc_range can be a string or null
  category: Category;
  created_at:Date;
}

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  products:WishlitProduct[]=[];

  loading:boolean=true;
  userId:string='';
  params:any={};
  totalProducts:number=0;

  constructor(private router:Router,private activatedRoute:ActivatedRoute, private productService:ProductService,private userService:UserService,private messsageService:MessageService){

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((response:any)=>{
      console.log(response);
      this.params=response;
      this.getWishlistProducts();
    })
    this.userId=this.userService.currentUser.user.id;
  }

  getWishlistProducts(){
    this.productService.getAllWishlistProducts(this.params).subscribe({
      next:(response:any)=>{
        this.products=response.wishlistItems;
        this.totalProducts=response.count;

        console.log(response);
        this.loading=false;
      },error:(err)=>{
        console.log(err);
        this.loading=false;
      }
    })
  }
  removeFromWishlist(id:string){
    this.loading=true;
    this.productService.removeProductFromWishlist(id).subscribe({
      next:(response:any)=>{
        this.messsageService.add({severity:'success',summary:'Success',detail:response.message})
        this.getWishlistProducts();
      },error:(err)=>{
        console.log(err);
        this.loading=false;
      }
    });
  }
  viewMoreProduct(){
    if(this.totalProducts>this.params.limit){
      this.router.navigate(['/wishlist'], { queryParams: {...this.params, limit:parseInt(this.params.limit)+9 }});
    }
  }
}
