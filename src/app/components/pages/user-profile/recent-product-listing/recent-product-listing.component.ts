import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/product.service';
@Component({
  selector: 'app-recent-product-listing',
  templateUrl: './recent-product-listing.component.html',
  styleUrls: ['./recent-product-listing.component.scss']
})
export class RecentProductListingComponent implements OnInit{

  products:IProduct[]=[];

  params:{
    limit:number,
    page:number
  }={
    limit:9,
    page:1
  };
  loading:boolean=true;


  constructor(private productService:ProductService){

  }
  ngOnInit(): void {
      this.getRecentListingProducts();
  }
  getRecentListingProducts(){
    this.productService.getRecentListingProducts(this.params).subscribe({
      next:(response:any)=>{
        this.products=response.products;
        this.loading=false;
        console.log(response);
      },error:(err)=>{
        console.log(err);
        this.loading=false;
      }
    });
  }
  viewMoreProducts(){
    this.params={...this.params,limit:this.params.limit+9};
    this.getRecentListingProducts();
  }

}
