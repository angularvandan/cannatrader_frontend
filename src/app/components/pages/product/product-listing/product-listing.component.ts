import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product';

interface Dropdown {
  name: string;
  code: string;
}

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss']
})
export class ProductListingComponent implements OnInit {

  products: Product[] = [
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },
    {
      name: 'Canopy Growth',
      image: '../../../../assets/product/product.png',
      strainType: 'Indica',
      thcRange: '22%',
      location: 'Ontario (5 Kilometer)',
      posted: 'a Day ago',
      flavour: 'chocolate'
    },

  ];

  strainTypes: Dropdown[] = [];
  selectedStrainType: Dropdown = { name: 'Indica', code: 'Indica' };

  categories: Dropdown[] = [];
  selectedCategory: Dropdown = { name: 'Edibles', code: 'Edibles' };

  subCategories: Dropdown[] = [];
  selectedSubCategory: Dropdown = { name: 'Chocolate', code: 'Chocolate' };

  thcRanges: Dropdown[] = [];
  selectedThcRange: Dropdown = { name: '20 - 30%', code: '20 - 30%' };

  newOld: Dropdown[] = [];
  selectedNewOld: Dropdown = { name: 'Newest (23)', code: 'Newest (23)' };

  sortOrder: any = { name: 'Newest (23)', code: 'Newest (23)' };
  sortOrderOpt: any[] = [{ name: 'Newest (23)', code: 'Newest (23)' }, { name: 'Oldest', code: 'Oldest' }];
  showSortOptions: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.strainTypes = [
      { name: 'Indica', code: 'Indica' },
      { name: 'Sativa', code: 'Sativa' },
      { name: 'Hybrid', code: 'Hybrid' },
    ];

    this.categories = [
      { name: 'Flower', code: 'Flower' },
      { name: 'Bio mass', code: 'Bio mass' },
      { name: 'Hemp', code: 'Hemp' },
      { name: 'Fresh frozen', code: 'Fresh frozen' },
      { name: 'Genetics', code: 'Genetics' },
      { name: 'Extracts-concentrates', code: 'Extracts-concentrates' },
      { name: 'Edibles', code: 'Edibles' },
      { name: 'Topicals', code: 'Topicals' },
      { name: 'Services', code: 'Services' },
      { name: 'Materials', code: 'Materials' },
      { name: 'Equipments', code: 'Equipments' }
    ];

    this.subCategories = [
      { name: 'Clones', code: 'Clones' },
      { name: 'Teens', code: 'Teens' },
      { name: 'Mothers', code: 'Mothers' },
      { name: 'Seeds', code: 'Seeds' },
      { name: 'Chocolate', code: 'Chocolate' },
    ];

    this.thcRanges = [
      { name: '0 - 10%', code: '0 - 10%' },
      { name: '10 - 20%', code: '10 - 20%' },
      { name: '20 - 30%', code: '20 - 30%' },
      { name: '30% Plus', code: '30% Plus' },
    ];

  }

  toggleSortOrder() {
    this.showSortOptions = !this.showSortOptions;
  }

  setSortOrder(order: string) {
    this.sortOrder = order;
    this.showSortOptions = false;
  }


}
