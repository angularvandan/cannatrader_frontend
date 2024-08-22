import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IProduct, Product } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss']
})
export class ProductListingComponent implements OnInit {

  products: IProduct[] = [];

  strainTypes: any[] = [];

  categories: any[] = [];

  subCategories: any[] = [{
    id: '', name: 'Sub Category'
  }];


  thcRanges: any[] = [];

  sortOrder: any = { name: 'Newest', code: 'Newest' };
  sortOrderOpt: any[] = [{ name: 'Newest', code: 'Newest' }, { name: 'Oldest', code: 'Oldest' }];

  params!: any;
  // filterform!: FormGroup;

  loadingForProduct: boolean = false;
  loadingError: boolean = false;
  totalProductCount: number = 0;
  isWishlisted: boolean = false;

  blockedPanel:boolean=true;

  constructor(private productService: ProductService,private userService:UserService, private tostr: ToastrService, private activatedRoute: ActivatedRoute, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {

    // this.filterform = this.fb.group({
    //   strain_type: [''],
    //   category: [''],
    //   sub_category: [''],
    //   thc_range: ['']
    // });

    this.activatedRoute.queryParams.subscribe({
      next: (params) => {

        this.params = params;
        console.log(this.params);
        // this.getSubCategoryById(this.params.category);
        this.getProductsOnFilter();


      }, error: (err) => {
        console.log(err);
      }
    });

    //this is for filter product
    // setTimeout(() => {
    //   this.filterform.valueChanges.subscribe(values => {
    //     this.onFormValuesChanged(values);
    //   });
    // }, 0);

    // this.filterform.get('category')?.valueChanges.subscribe(categoryId => {
    //   this.getSubCategoryById(categoryId?.id || '');
    // });


    //this is for view all products drop down value
    // this.productService.getAllValueForAddProduct().subscribe((response: any) => {
    //   console.log(response);
    //   this.categories = response[0].data;
    //   this.thcRanges = response[1].data;
    //   this.strainTypes = response[2].data;

    //   this.filterform.patchValue({
    //     strain_type: this.strainTypes.find((item: any) => {
    //       if (item.id == this.params.strain_type) {
    //         return item;
    //       }
    //     }),
    //     category: this.categories.find((item: any) => {
    //       if (item.id == this.params.category) {
    //         return item;
    //       }
    //     }),
    //     sub_category: this.subCategories.find((item: any) => {

    //       if (item.id == this.params.sub_category) {
    //         return item;
    //       }

    //     }),
    //     thc_range: this.thcRanges.find((item: any) => {

    //       if (item.id == this.params.thc_range) {
    //         return item;
    //       }
    //     })
    //   });
    // console.log(this.subCategories);
    // console.log(this.filterform);
    // });

    //when refress then patch the value of filter dropdownn

  }
  get isAuth(){
      if(this.userService.currentUser.token){
        return false;
      }
      return true;
  }
  // this is call for sub category
  // getSubCategoryById(id: any) {
  //   if (id != '') {
  //     this.productService.getSubCategory(id).subscribe((response: any) => {
  //       console.log(response.data);
  //       //this is added when category has no sub category;
  //       this.subCategories = [{
  //         id: '', name: 'Sub Category'
  //       }];
  //       this.subCategories = this.subCategories.concat(response.data);

  //     }, (err: any) => {
  //       //when sub category not found
  //       this.filterform.patchValue({
  //         sub_category: {
  //           id: '', name: 'Sub Category'
  //         }
  //       });
  //       this.subCategories = [{
  //         id: '', name: 'Sub Category'
  //       }];
  //     })
  //   }
  // }

  //filter in product listing page

  // onFormValuesChanged(valuesforFilter: any) {

  //   console.log(valuesforFilter);
  //   this.params = {
  //     ...this.params,
  //     category: valuesforFilter.category?.id || '',
  //     sub_category: valuesforFilter.sub_category?.id || '',
  //     strain_type: valuesforFilter.strain_type?.id || '',
  //     thc_range: valuesforFilter.thc_range?.id || '',
  //   }
  //   this.router.navigate(['/products'], { queryParams: this.params });

  // }

  // this is for api call of get products
  getProductsOnFilter() {
    this.loadingForProduct = true;

    this.productService.getAllProducts(this.params).subscribe({
      next: (response: any) => {
        console.log(response);

        this.products = response.products;
        this.totalProductCount = response.count;

        console.log(this.products);
        this.loadingForProduct = false;
        // this.sortByAscendingAndDeceding({code:'Newest'});

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
            this.tostr.success(response.message);
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
            this.tostr.success(response.message);
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
  

  // sortByAscendingAndDeceding(value:any) {
  //   console.log(value);
  //   if(value.code!='Newest'){

  //     this.products.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  //   }
  //   else{
  //     this.products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  //   }
  // }

}
