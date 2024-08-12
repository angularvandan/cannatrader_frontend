import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { IProduct } from 'src/app/shared/models/product';
import { ProductService } from 'src/app/shared/services/product.service';

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

  subCategories = [

  ];

  selectedLicenseFile: File | null = null;
  selectedImageFiles: File[] = [];

  imagePreviews: string[] = [];
  selectedFile: File | null = null;
  loading: boolean = false;
  productId: string | null = '';

  productForm!: FormGroup;
  product!: IProduct;


  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private productService: ProductService, private tostr: ToastrService, private fb: FormBuilder, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.productId = params.get('id');
      console.log('Product ID:', this.productId);
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
      images: ['', Validators.required],
      pdf: ['', Validators.required]
    });

    this.productForm.get('category')?.valueChanges.subscribe(categoryId => {
      console.log(categoryId);
      if (categoryId.id) {
        this.getSubCategoryById(categoryId.id);
      }
      
    });

  }
  getAllDropDownValue(){
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

    }, (err: any) => {

    });
  }

  getSubCategoryById(id: any) {
    this.productService.getSubCategory(id).subscribe((response: any) => {
      // console.log(response);
      this.subCategories = response.data;
    })
  }
  getProductByActivatedRoute() {
    if (this.productId != '' && this.productId != null) {
      this.productService.getProductById(this.productId).subscribe({
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
      strain_type: this.strainTypes.find((item: any) => {
        if (item.id == this.product.strain_type) {
          return item;
        }
      }),
      thc_range: this.thcRange.find((item: any) => {
        if (item.id == this.product.thc_range) {
          return item;
        }
      }),
      category: this.categories.find((item: any) => {
        if (item.id == this.product.category) {
          return item;
        }
      }),
      lineage: this.product.lineage,
      thc_total: this.product.thc_total,
      harvest_date: this.product.harvest_date,
      terpene: this.product.terpene,
      cbd: this.product.cbd,
      grade: this.product.grade,
      available: this.product.available,
      grow_media: this.growMedia.find((item: any) => {
        if (item.id == this.product.grow_media) {
          return item;
        }
      }),
      growth_method: this.growthMethod.find((item: any) => {
        if (item.id == this.product.growth_method) {
          return item;
        }
      }),
      irradiated: this.product.irradiated,
      dry_method: this.dryMethod.find((item: any) => {
        if (item.id == this.product.dry_method) {
          return item;
        }
      }),
      bud_size: this.product.bud_size,
      trim_method: this.trimMethod.find((item: any) => {
        if (item.id == this.product.trim_method) {
          return item;
        }
      }),
      tops: this.product.tops,
      mids: this.product.mids,
      description: this.product.description,
      lowers: this.product.lowers,
      latitude: this.product.location.coordinates[0],
      longitude: this.product.location.coordinates[0],
      pdf:this.product.coa_document,
      images:this.product.images

    });
    this.imagePreviews=this.product.images;
    // this.selectedFile=this.product.coa_document;
    this.preloadFile();
  }
  preloadFile() {
    this.selectedFile = null;
    const blob = new Blob(['file content'], { type: 'application/pdf' });
    const file = new File([blob], this.product.coa_document, { type: 'application/pdf' });
    this.productForm.patchValue({
      pdf: file
    });
    this.selectedFile=file;
  }


  confirm1() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the product details?',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
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
    if (type === 'images') {
      if (files.length + this.selectedImageFiles.length > 5) {
        alert('You can only upload a maximum of 5 images.');
        return;
      }

      for (let file of files) {
        this.selectedImageFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }

      //here patch the value of image
      this.productForm.patchValue({
        images: this.selectedImageFiles
      })
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      this.productForm.patchValue({
        pdf: this.selectedFile
      })
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.productForm.patchValue({
      pdf: this.selectedFile
    })
  }

  removeImg(type: string, file: File) {
    if (type === 'images') {
      const index = this.selectedImageFiles.indexOf(file);
      if (index > -1) {
        this.selectedImageFiles.splice(index, 1);
        this.imagePreviews.splice(index, 1);

        this.productForm.patchValue({
          images: this.selectedImageFiles
        })
      }
    }
  }

  onSubmit(): void {

    if(this.productForm.valid){

      console.log(this.selectedLicenseFile);
      console.log(this.selectedImageFiles);
      console.log(this.productForm);
    }
    else{
      this.productForm.markAllAsTouched();
      console.log(this.productForm);
    }
  }
}
