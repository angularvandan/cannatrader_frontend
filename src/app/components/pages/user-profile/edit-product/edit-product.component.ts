import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { IProduct } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class EditProductComponent {
  date!: Date
  strainTypes = [

  ];
  thcRange = [

  ]

  categories = [

  ];

  growthMethod = [


  ]
  growMedia = [

  ]

  dryMethod = [

  ]
  trimMethod = [

  ]

  subCategories: any[] = [];

  selectedImageFiles: File[] = [];
  imagePreviews: string[] = [];

  imagesLinksContainer:string[]=[];
  pdfLinksContainer:string | null='';
  pdfDocName:string='';
  tempImagesPreview:string[]=[];

  loading: boolean = false;
  loadingForPatchValue: boolean = false;
  productId: string | null = '';

  productForm!: FormGroup;
  product!: IProduct;
  userId:string='';


  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private productService: ProductService, private tostr: ToastrService, private fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router,private userService:UserService) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.productId = params.get('id');
      console.log('Product ID:', this.productId);
      this.userId=this.userService.currentUser.user.id;

      this.getProductByActivatedRoute();
    });

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
      irradiated: ['', Validators.required],
      dry_method: ['', Validators.required],
      bud_size: ['', Validators.required],
      trim_method: ['', Validators.required],
      tops: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      mids: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      description: ['', Validators.required],
      lowers: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      latitude: ['12312', Validators.required],
      longitude: ['12312', Validators.required],
      location: ['pune'],

      // For file inputs, you will need to handle them separately
      imageUrls: ['', Validators.required],
      pdfUrl: ['', Validators.required]
    });

    this.productForm.get('category')?.valueChanges.subscribe(categoryId => {
      console.log(categoryId);
      if (categoryId.id) {
        this.getSubCategoryById(categoryId?.id || '');
      }

    });



  }
  getAllDropDownValue() {
    this.productService.getAllValueForAddProduct().subscribe((response: any) => {
      console.log(response);
      this.categories = response[0].data;
      this.thcRange = response[1].data;
      this.strainTypes = response[2].data;
      this.growMedia = response[3].data;
      this.growthMethod = response[4].data;
      this.trimMethod = response[5].data;
      this.dryMethod = response[6].data;


      //when all sub category and category is loaded then patch
      this.patchValueOfProduct();
      this.loadingForPatchValue = false;

    }, (err: any) => {
      console.log(err);
      this.loadingForPatchValue = false;
    });
  }

  getSubCategoryById(id: any) {
    if (id != '') {
      this.productService.getSubCategory(id).subscribe((response: any) => {
        console.log(response.data);
        this.subCategories = response.data;

      }, (err: any) => {
        //when sub category not found
        // this.productForm.patchValue({
        //   sub_category: {
        //     id: '', name: 'Sub Category'
        //   }
        // });
        this.subCategories = [{
          id: '', name: 'No Result Found'
        }];
      })
    }
  }
  getProductByActivatedRoute() {
    //this loading status will be false in patch value data;
    this.loadingForPatchValue = true;

    if (this.productId != '' && this.productId != null) {
      this.productService.getProductById(this.productId,this.userId).subscribe({
        next: (response: any) => {
          console.log(response);
          this.product = response.product;
          this.getAllDropDownValue();
        }, error: (err) => {
          console.log(err);
        }
      })
    }
  }
  patchValueOfProduct() {
    this.productForm.patchValue({
      name: this.product.name,
      strain_type: this.product.strain_types,
      thc_range: this.product.thc_ranges,
      category: this.product.categories,
      sub_category: { ...this.product.subCategory, category: this.product.categories },
      lineage: this.product.lineage,
      thc_total: this.product.thc_total,
      harvest_date: new Date(this.product.harvest_date),
      terpene: this.product.terpene,
      cbd: this.product.cbd,
      grade: this.product.grade,
      available: this.product.available,
      grow_media: this.product.grow_medias,
      growth_method: this.product.growth_methods,
      irradiated: this.product.irradiated ? 'yes' : 'no',
      dry_method: this.product.dry_methods,
      bud_size: this.product.bud_size,
      trim_method: this.product.trim_methods,
      tops: this.product.tops,
      mids: this.product.mids,
      description: this.product.description,
      lowers: this.product.lowers,
      latitude: this.product.location.coordinates[0],
      longitude: this.product.location.coordinates[0],
      imageUrls:this.product.images,
      pdfUrl:this.product.coa_document
    });
    //image preview for show the image in form
    this.imagePreviews = [...this.product.images];
    this.imagesLinksContainer=[...this.product.images];
    this.pdfLinksContainer=this.product.coa_document;

    this.pdfDocName=this.pdfLinksContainer.substring(this.pdfLinksContainer.lastIndexOf('/') + 1);
    this.pdfDocName=decodeURIComponent(this.pdfDocName).replace(/^\d+-/, '');

    // console.log(this.imagePreviews);
    // console.log(this.imagesLinksContainer);
    // console.log(this.pdfLinksContainer);
  }


  confirm1() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the product details?',
      accept: () => {
        if (this.productId) {
          this.productService.deleteProductById(this.productId).subscribe({
            next: () => {
              this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
              setTimeout(() => {
                this.router.navigate(['/profile/profile-details']);
              }, 1000);
            }, error: () => {
              this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            }
          });
        }
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }

  onImageSelected(event: any, type: string) {
    const files = event.target.files;
    console.log(files);
    if (type === 'images') {
      if (files.length + this.selectedImageFiles.length > 5) {
        alert('You can only upload a maximum of 5 images.');
        return;
      }
      for (let file of files) {
        this.selectedImageFiles.push(file);
        //method for conver image into url
        this.convertIntoImageUrl(file);
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      //this method for convert pdf into url
      this.convertIntoPdfUrl(input.files[0]);
    }
  }

  convertIntoImageUrl(file:File){

    const formData=new FormData();
    formData.append('images',file);

    this.productService.imageFileToImageUrl(formData).subscribe({
      next:(response:any)=>{
        this.imagesLinksContainer.push(response.imageLinks[0]);
        this.imagePreviews=this.imagePreviews.concat(response.imageLinks[0]);
        console.log(this.imagesLinksContainer);

        this.productForm.patchValue({
          imageUrls:this.imagesLinksContainer
        });

      },error:(err)=>{
        console.log(err);
      }
    })
  }

  convertIntoPdfUrl(file:File){
    const formData=new FormData();
    formData.append('pdf',file);

    this.productService.pdfImageToPdfUrl(formData).subscribe({
      next:(response:any)=>{
        this.pdfLinksContainer=response.pdfUrl;

        this.productForm.patchValue({
          pdfUrl:this.pdfLinksContainer
        });

        console.log(this.pdfLinksContainer);
      },error:(err)=>{
        console.log(err);
      }
    })
  }

  removeFile(): void {
    this.pdfLinksContainer=null;

    this.productForm.patchValue({
      pdfUrl:null
    })
  }

  removeImg(type: string, link: string) {
    if (type === 'images') {
      const index = this.imagesLinksContainer.indexOf(link);
      if (index > -1) {
        this.imagesLinksContainer.splice(index, 1);
        this.imagePreviews.splice(index, 1);
        console.log(this.imagesLinksContainer);

        this.productForm.patchValue({
          imageUrls:this.imagesLinksContainer
        })

      }
    }
  }

  onSubmit() {

    if (this.productForm.valid && this.productId != null) {

      this.productForm.removeControl('location');
      let body:any={};

      if(!this.productForm.value.sub_category){
        this.productForm.removeControl('sub_category');

        body={
          ...this.productForm.value,
          strain_type:this.productForm.value.strain_type.id,
          thc_range:this.productForm.value.thc_range.id,
          category:this.productForm.value.category.id,
          growth_method:this.productForm.value.growth_method.id,
          grow_media:this.productForm.value.grow_media.id,
          dry_method:this.productForm.value.dry_method.id,
          trim_method:this.productForm.value.trim_method.id,
        }
        this.productForm.addControl('sub_category',new FormControl(null));

      }
      else{
        body={
          ...this.productForm.value,
          strain_type:this.productForm.value.strain_type.id,
          thc_range:this.productForm.value.thc_range.id,
          category:this.productForm.value.category.id,
          sub_category:this.productForm.value.sub_category.id,
          growth_method:this.productForm.value.growth_method.id,
          grow_media:this.productForm.value.grow_media.id,
          dry_method:this.productForm.value.dry_method.id,
          trim_method:this.productForm.value.trim_method.id,
        }
      }

      this.productForm.addControl('location',new FormControl('pune'));

      console.log(this.productForm);
      console.log(body);
      this.loading = true;
      
      this.productService.editProductById(this.productId, body).subscribe({
        next: (response: any) => {
          // console.log(response);
          this.loading = false;
          this.tostr.success('Updated Successfully');
          this.getProductByActivatedRoute();
          window.scrollTo(0, 0);
          
        }, error: (err:any) => {
          console.log(err);
          this.loading = false;
          this.tostr.error(err);
        }
      });

    }
    else {
      console.log(this.productForm);
      this.productForm.markAllAsTouched();
    }
  }
}
