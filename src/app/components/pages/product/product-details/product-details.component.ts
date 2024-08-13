import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  value: number = 4;
  rate: number = 0

  btn = true
  paragraph: string = `Our premium cannabis dried flower is cultivated from top-quality strains, ensuring a potent and aromatic
                experience Our premium cannabis dried flower is cultivated from top-quality strains, ensuring `;
  charLimit: number = 100;
  showAll: boolean = false;

  product!: IProduct;
  productId!: string|null;
  loading:boolean=true;
  user!:UserDetails;

  constructor(private productService: ProductService,private userService:UserService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('id')) {
        this.productId = params.get('id');
        this.getSingleProduct();
      }
      console.log('Product ID:', this.productId);
    });
    this.user=this.userService.currentUser.user;
    console.log(this.user);

  }

  getSingleProduct(){
    if(this.productId){
      this.productService.getProductById(this.productId).subscribe({
        next:(response:any)=>{
          this.product=response.product;
          this.loading=false;
        },error:(err)=>{
          console.log(err);
          this.loading=false;
        }
      })
    }
  }

  toggleBtn() {
    this.btn = !this.btn
  }

  toggleViewMore() {
    this.showAll = !this.showAll;
  }
}
