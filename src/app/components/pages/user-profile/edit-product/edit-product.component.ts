import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  subCategories: any[] = [{
    id: '', name: 'Sub Category'
  }];

  selectedImageFiles: File[] = [];
  imagePreviews: string[] = [];
  selectedFile: File | null = null;

  imagesLinksContainer:string[]=[];

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
      images: ['', Validators.required],
      pdf: ['', Validators.required]
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
        //this is added when category has no sub category;
        this.subCategories = [{
          id: '', name: 'Sub Category'
        }];
        this.subCategories = this.subCategories.concat(response.data);

      }, (err: any) => {
        //when sub category not found
        this.productForm.patchValue({
          sub_category: {
            id: '', name: 'Sub Category'
          }
        });
        this.subCategories = [{
          id: '', name: 'Sub Category'
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

    });
    this.imagePreviews = [...this.product.images];
    console.log(this.imagePreviews);
    // this.selectedFile=this.product.coa_document;
    this.preloadFile();
  }
  async preloadFile() {

    //this is for select pdf
    this.convertPdfUrlToFile(this.product.coa_document)
      .then(file => {
        // console.log(file);
        this.productForm.patchValue({
          pdf: file
        });
        this.selectedFile = file;
      }).catch(error => {
        console.error('Error converting PDF to file:', error);
      });

    // below code for images convert into  file;
    this.selectedImageFiles = [];
    this.convertMultipleImages(this.product.images).then(files => {
      this.productForm.patchValue({
        images: files
      })
      this.selectedImageFiles = files;
      console.log(files);
    }).catch(error => {
      console.error('Error converting images to files:', error);
    });
  }

  //this is for pdf converter in file
  async convertPdfUrlToFile(url: string, filename: string = 'document.pdf'): Promise<File> {
    const pdfData = await fetch(url).then(res => res.arrayBuffer());
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    return new File([blob], filename, { type: 'application/pdf' });
  }

  //for file converter
  async urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
    const imageData = await fetch(url).then(res => res.arrayBuffer());
    // console.log(imageData)
    const blob = new Blob([imageData], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
  }

  async convertMultipleImages(imageUrls: string[]): Promise<File[]> {
    const files: File[] = [];

    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const fileName = `image-${i + 1}.jpg`; // Generate a file name based on index
      const file = await this.urlToFile(url, fileName, 'image/jpeg');
      files.push(file);
    }

    return files;
  }

  confirm1() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the product details?',
      accept: () => {
        if (this.productId) {
          this.productService.deleteProductById(this.productId).subscribe({
            next: () => {
              this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
              this.router.navigate(['/profile/profile-details']);
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
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }

      //here patch the value of image
      this.productForm.patchValue({
        images: this.selectedImageFiles
      });
      // console.log(this.selectedImageFiles);
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

  convertIntoImageUrl(file:File){

    const formData=new FormData();
    formData.append('images',file);

    this.productService.imageFileToImageUrl(formData).subscribe({
      next:(response:any)=>{
        this.imagesLinksContainer=response.imageLinks;
        console.log(this.imagesLinksContainer);
      },error:(err)=>{
        console.log(err);
      }
    })
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

  onSubmit() {

    if (this.productForm.valid && this.productId != null) {

      console.log(this.productForm);
      this.loading = true;
      //append data into formData
      const formData = new FormData();

      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (key == 'pdf' || key == 'images') {
          // console.log(control?.value);
          for (let i = 0; i < control?.value.length; i++) {
            formData.append(key, control?.value[i]);
            // console.log(control?.value[i])
          }
          if (key == 'pdf') {
            formData.append(key, control?.value);
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
      formData.delete('location');

      this.productService.editProductById(this.productId, formData).subscribe({
        next: (response: any) => {
          // console.log(response);
          this.loading = false;
          this.tostr.success('Updated Successfully');
          this.getProductByActivatedRoute();

        }, error: (err) => {
          // console.log(err);
          this.loading = false;
          this.tostr.error(err.error.error.message);

        }
      });

    }
    else {
      this.productForm.markAllAsTouched();
    }
  }
}
