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

  onFileSelected(event: any, type: any): void {
    if (type === 'license') {
      this.selectedLicenseFile = event.target.files[0];
    } else if (type === 'images') {
      this.selectedImageFiles = Array.from(event.target.files);
    }
  }

  removeFile(type: any, file: File): void {
    if (type === 'license') {
      this.selectedLicenseFile = null;
    } else if (type === 'images') {
      this.selectedImageFiles = this.selectedImageFiles.filter(f => f !== file);
    }
  }

  onSubmit(): void {
    console.log(this.productDetails);
    console.log(this.selectedLicenseFile);
    console.log(this.selectedImageFiles);
    // Perform the form submission to the backend or further processing here
  }
}
