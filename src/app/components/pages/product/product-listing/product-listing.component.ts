import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/models/product';


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

  categories: any[] = [{ label: 'Indica', value: 'Indica' }];
  types: any[] = [{ label: 'Edible', value: 'Edible' }];
  flavors: any[] = [{ label: 'Chocolate', value: 'Chocolate' }];
  thcRanges: any[] = [{ label: '20-30%', value: '20-30%' }];

  selectedCategory: any;
  selectedType: any;
  selectedFlavor: any;
  selectedThcRange: any;

  sortOrder: string = 'Newest';
  showSortOptions: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleSortOrder() {
    this.showSortOptions = !this.showSortOptions;
  }

  setSortOrder(order: string) {
    this.sortOrder = order;
    this.showSortOptions = false;
  }


}
