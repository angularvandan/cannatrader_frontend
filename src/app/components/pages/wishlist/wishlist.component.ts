import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private productService:ProductService,private userService:UserService,private toastr:ToastrService){

  }

  ngOnInit(): void {
    this.getWishlistProducts();
    this.userId=this.userService.currentUser.user.id;
  }

  getWishlistProducts(){
    this.productService.getAllWishlistProducts().subscribe({
      next:(response:any)=>{
        this.products=response.wishlistItems;
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
        this.toastr.success(response.message);
        this.getWishlistProducts();
      },error:(err)=>{
        console.log(err);
        this.loading=false;
      }
    });
  }
}
