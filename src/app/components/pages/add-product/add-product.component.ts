import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserDetails } from 'src/app/shared/models/user';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  date!: Date;

  strainTypes = [
    
  ];
  thcRange=[
    
  ]

  categories = [
    
  ];

  growthMethod=[
    

  ]
  growMedia=[
    
  ]

  dryMethod=[
    
  ]
  trimMethod=[
    
  ]

  subCategories = [
    
  ];

  selectedLicenseFile: File | null = null;
  selectedImageFiles: File[] = [];
  imagePreviews: string[] = [];
  selectedFile: File | null = null;
  loading:boolean=false;


  user!:UserDetails;

  companyDocumentStatus:boolean=false;

  productForm!: FormGroup;

  constructor(private userService:UserService,private fb: FormBuilder,private productService:ProductService,private tostr:ToastrService) { }

  ngOnInit(): void {
    this.user=this.userService.currentUser.user;
    this.companyDocumentStatus=this.user.is_company;

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      strain_type: ['', Validators.required],
      thc_range: ['', Validators.required],
      category: ['', Validators.required],
      lineage: [''],
      sub_category: [''],
      thc_total: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      harvest_date: ['', Validators.required],
      terpene: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      cbd: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      grade: ['', Validators.required],
      available: ['', [Validators.required, Validators.min(0)]],
      grow_media: ['', Validators.required],
      growth_method: ['', Validators.required],
      irradiated: ['yes', Validators.required],
      dry_method: ['', Validators.required],
      bud_size: ['', Validators.required],
      trim_method: ['', Validators.required],
      tops: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      mids: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      description: ['', Validators.required],
      lowers: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      latitude: ['12312', Validators.required],
      longitude: ['12312', Validators.required],

      // For file inputs, you will need to handle them separately
      images: ['',Validators.required],
      pdf: ['',Validators.required]
    });

    this.productService.getAllValueForAddProduct().subscribe((response:any) => {
      console.log(response);
      this.categories=response[0].data;
      this.thcRange=response[1].data;
      this.strainTypes=response[2].data;
      this.growMedia=response[3].data;
      this.growthMethod=response[4].data;
      this.trimMethod=response[5].data;
      this.dryMethod=response[6].data;
    });

    this.productForm.get('category')?.valueChanges.subscribe(categoryId => {
      // console.log(categoryId);
      this.getSubCategoryById(categoryId.id);
    });

  }
  getSubCategoryById(id:any){
    this.productService.getSubCategory(id).subscribe((response:any)=>{
        this.subCategories=response.data;
    },()=>{
      this.subCategories=[];
    })
  }

  onImageSelected(event: any, type: string) {
    const files = event.target.files;
    if (type === 'images') {
      if (files.length + this.selectedImageFiles.length > 5) {
        alert('You can only upload a maximum of 5 images.');
        return;
      }

      for (let file of files) {
        this.selectedImageFiles.push(file);
        //below code for show  image in add product
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
      //here patch the value of image
      this.productForm.patchValue({
        images:this.selectedImageFiles
      })
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      this.productForm.patchValue({
        pdf:this.selectedFile
      })
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.productForm.patchValue({
      pdf:this.selectedFile
    })
  }

  removeImg(type: string, file: File) {
    if (type === 'images') {
      const index = this.selectedImageFiles.indexOf(file);
      if (index > -1) {
        this.selectedImageFiles.splice(index, 1);
        this.imagePreviews.splice(index, 1);

        this.productForm.patchValue({
          images:this.selectedImageFiles
        })
      }
    }
  }

  onSubmit(): void {

    if(this.productForm.valid){ 
      // console.log(this.productForm);

      this.loading=true;
      const formData = new FormData();

      if(this.productForm.get('sub_category')?.value == ""){
        this.productForm.removeControl('sub_category');
        // console.log(this.productForm);
      }

      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (key=='pdf'||key=='images') {
          // console.log(control?.value);
          for (let i = 0; i < control?.value.length; i++) {
            formData.append(key, control?.value[i]);
            // console.log(control?.value[i])
          }
          if(key=='pdf'){
            formData.append(key,control?.value);
          }
        } else if (key === 'harvest_date') {

          const date = new Date(control?.value);
          const formattedDate = date.toISOString().split('T')[0]; // Convert to yyyy-mm-dd format
          formData.append(key, formattedDate);

        } else if (typeof control?.value === 'object' && control.value !== null) {
          formData.append(key, control.value.id);
        } else {
          formData.append(key, control?.value);
        }
      });
      
      //api call for add product
      this.productService.addProduct(formData).subscribe({
        next:(response)=>{
          // console.log(response);
          this.tostr.success('Product added successfully');
          this.loading=false;
        },error:(err)=>{
          // console.log(err);
          this.tostr.error(err.error.error.message);
          this.loading=false;
        }
      });
    }
    else{
      console.log(this.productForm);
      this.productForm.markAllAsTouched();
    }
  }
}
