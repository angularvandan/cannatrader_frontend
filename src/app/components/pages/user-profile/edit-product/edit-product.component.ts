import { Component } from '@angular/core';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class EditProductComponent {
  date!: Date
  productDetails = {
    lotId: '',
    thcRange: '',
    lineage: '',
    thcTotal: null,
    terpene: null,
    grade: '',
    growMedia: '',
    irradiated: 'Yes',
    budSize: '',
    tops: null,
    mids: null,
    lowers: null,
    location: '',
    selectedStrainType: null,
    selectedCategory: null,
    selectedSubCategory: null,
    harvestDate: null,
    cbd: null,
    available: null,
    growthMethod: '',
    dryMethod: '',
    trimMethod: '',
    description: ''
  };

  strainTypes = [
    { name: 'Indica' },
    { name: 'Sativa' },
    { name: 'Hybrid' }
  ];
  thcRange=[
    { name: '0 - 10%' },
    { name: '10 - 20%' },
    { name: '20 - 30%' },
    { name: '30% Plus' },
  ]

  categories = [
    { name: 'Flower' },
    { name: 'Bio mass' },
    { name: 'Hemp' },
    { name: 'Fresh frozen' },
    { name: 'Genetics' },
    { name: 'Extracts-concentrates' },
    { name: 'Edibles' },
    { name: 'Topicals' },
    { name: 'Services' },
    { name: 'Materials' },
    { name: 'Equipments' }
  ];

  growthMethod=[
    {name:'Standard'},
    {name:'Micro'},
    {name:'Indoor'},
    {name:'Outdoor'},
    {name:'Greenhouse'},

  ]
  growMedia=[
    {name:'Coco'},
    {name:'Soiless Mix'},
    {name:'Perlite'},
    {name:'Vermiculite'},
    {name:'Hydroponic'},
  ]

  dryMethod=[
    {name:'Hang'},
    {name:'Tray'}
  ]
  trimMethod=[
    {name:'Machine'},
    {name:'Hand'},
    {name:'Machine-Hand'},
    {name:'Not Trimmed'}
  ]

  subCategories = [
    { name: 'Clones' },
    { name: 'Teens' },
    { name: 'Mothers' },
    { name: 'Seeds' }
  ];

  selectedLicenseFile: File | null = null;
  selectedImageFiles: File[] = [];

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) { }

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

  ngOnInit(): void {
  }

  imagePreviews: string[] = [];

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
    }
  }

  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  removeImg(type: string, file: File) {
    if (type === 'images') {
      const index = this.selectedImageFiles.indexOf(file);
      if (index > -1) {
        this.selectedImageFiles.splice(index, 1);
        this.imagePreviews.splice(index, 1);
      }
    }
  }

  onSubmit(): void {
    console.log(this.productDetails);
    console.log(this.selectedLicenseFile);
    console.log(this.selectedImageFiles);
    // Perform the form submission to the backend or further processing here
  }
}
