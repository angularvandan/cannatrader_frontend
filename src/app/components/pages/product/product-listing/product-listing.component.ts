import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { IProduct, } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss']
})
export class ProductListingComponent implements OnInit {

  products: IProduct[] = [];

  params!: any;

  loadingForProduct: boolean = false;
  loadingError: boolean = false;
  totalProductCount: number = 0;
  isWishlisted: boolean = false;

  constructor(private productService: ProductService, private userService: UserService,  private activatedRoute: ActivatedRoute, private router: Router,private messageService:MessageService) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe({
      next: (params) => {

        this.params = params;
        console.log(this.params);
        this.getProductsOnFilter();

      }, error: (err) => {
        console.log(err);
      }
    });

  }
  get isAuth() {
    if (this.userService.currentUser.token) {
      return false;
    }
    return true;
  }

  getProductsOnFilter() {
    this.loadingForProduct = true;

    this.productService.getAllProducts(this.params).subscribe({
      next: (response: any) => {
        console.log(response);

        this.products = response.products;
        this.totalProductCount = response.count;

        console.log(this.products);
        this.loadingForProduct = false;

      }, error: (err) => {
        console.log(err);

        this.loadingError = true;
        this.loadingForProduct = false;

      }
    })
  }
  // when click on view more product
  viewMoreProducts() {
    if (this.totalProductCount >= this.params.limit) {
      this.params = { ...this.params, limit: parseInt(this.params.limit) + 9 }
      this.router.navigate(['/products'], { queryParams: this.params });
    }
  }

  addProductToWishlist(id: string) {
    const productIndex = this.products.findIndex((product: IProduct) => product.id === id);
    if (productIndex !== -1) {
      const product = this.products[productIndex];

      if (!product.isWishlisted) {
        this.products[productIndex] = { ...product, isWishlisted: true };

        this.productService.addProductToWishlist(id).subscribe({
          next: (response: any) => {
            this.messageService.add({severity:'success',summary:'Success',detail:response.message})
          },
          error: (err) => {
            console.log(err);
            this.products[productIndex] = { ...product, isWishlisted: false };

          }
        });
      }
      else {
        this.products[productIndex] = { ...product, isWishlisted: false };
        this.productService.removeProductFromWishlist(id).subscribe({
          next: (response: any) => {
            this.messageService.add({severity:'success',summary:'Success',detail:response.message})
            // Update the product in the list
          },
          error: (err) => {
            console.log(err);
            this.products[productIndex] = { ...product, isWishlisted: true };
          }
        });
      }
    }
  }

}
