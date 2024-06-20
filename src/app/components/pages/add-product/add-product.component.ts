import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

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
    { name: 'Type1' },
    { name: 'Type2' },
    { name: 'Type3' }
  ];

  categories = [
    { name: 'Category1' },
    { name: 'Category2' },
    { name: 'Category3' }
  ];

  subCategories = [
    { name: 'SubCategory1' },
    { name: 'SubCategory2' },
    { name: 'SubCategory3' }
  ];

  selectedLicenseFile: File | null = null;
  selectedImageFiles: File[] = [];

  constructor() { }

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
