import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';

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

  constructor(private productService:ProductService){

  }

  ngOnInit(): void {
    this.getWishlistProducts();
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
}
