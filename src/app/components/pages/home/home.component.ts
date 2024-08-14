import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  strainTypes:any[]=[];
  categories:any[]=[];
  subCategories:any[]=[];
  thcRange:any[]=[];
  searchWithin:any[]=[];

  searchForm!: FormGroup;
  loading:boolean=true;

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router) {

  }


  ngOnInit() {

    this.searchWithin = [
      { name: '--Select (km)--', code: '' },
      { name: '5Km', code: '5' },
      { name: '10Km', code: '10' },
      { name: '15Km', code: '15' },
      { name: '20Km', code: '20' },
    ];

    this.searchForm = this.fb.group({
      strain_type: [''],
      category: [''],
      sub_category: [''],
      thc_range: [''],
      longitude: [''],
      latitude: [''],
      distance: [''],

    });
    this.productService.getAllValueForAddProduct().subscribe((response: any) => {
      console.log(response);
      this.categories = response[0].data;
      this.thcRange = response[1].data;
      this.strainTypes = response[2].data;
      this.loading=false;
    },(err)=>{
      this.loading=false;
    });
    this.searchForm.get('category')?.valueChanges.subscribe(categoryId => {
      this.getSubCategoryById(categoryId.id);
    });
  }

  getSubCategoryById(id: any) {
    this.productService.getSubCategory(id).subscribe((response: any) => {
      this.subCategories = response.data;
    })
  }

  onSubmit() {
    if (!this.searchForm.valid) {
      this.searchForm.markAllAsTouched();
      return;
    }
    console.log(this.searchForm);
    const payload = {
      strain_type: this.searchForm.value.strain_type.id || '',
      category: this.searchForm.value.category.id || '',
      sub_category: this.searchForm.value.sub_category.id || '',
      thc_range: this.searchForm.value.thc_range.id || '',
      longitude: this.searchForm.value.longitude,
      latitude: this.searchForm.value.latitude,
      distance: this.searchForm.value.distance,
      limit: 9,
      page: 1
    }
    console.log(payload);
    this.router.navigate(['/products'], { queryParams: payload });

  }

}
