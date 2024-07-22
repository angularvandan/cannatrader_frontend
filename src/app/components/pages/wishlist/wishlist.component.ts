import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  products = [
    {
      name: 'Canopy Growth',
      description: 'Vanilla',
      strainType: 'Sativa',
      thcRange: '18%',
      location: 'Quebec (10 Kilometer)',
      imageUrl: '../../../../../assets/product/product.png',
      posted: '2 Days ago'
    },
    {
      name: 'Canopy Growth',
      description: 'Vanilla',
      strainType: 'Sativa',
      thcRange: '18%',
      location: 'Quebec (10 Kilometer)',
      imageUrl: '../../../../../assets/product/product.png',
      posted: '2 Days ago'
    },
    {
      name: 'Canopy Growth',
      description: 'Vanilla',
      strainType: 'Sativa',
      thcRange: '18%',
      location: 'Quebec (10 Kilometer)',
      imageUrl: '../../../../../assets/product/product.png',
      posted: '2 Days ago'
    },
    {
      name: 'Canopy Growth',
      description: 'Vanilla',
      strainType: 'Sativa',
      thcRange: '18%',
      location: 'Quebec (10 Kilometer)',
      imageUrl: '../../../../../assets/product/product.png',
      posted: '2 Days ago'
    },
    {
      name: 'Canopy Growth',
      description: 'Vanilla',
      strainType: 'Sativa',
      thcRange: '18%',
      location: 'Quebec (10 Kilometer)',
      imageUrl: '../../../../../assets/product/product.png',
      posted: '2 Days ago'
    },
    {
      name: 'Canopy Growth',
      description: 'Vanilla',
      strainType: 'Sativa',
      thcRange: '18%',
      location: 'Quebec (10 Kilometer)',
      imageUrl: '../../../../../assets/product/product.png',
      posted: '2 Days ago'
    },
    {
      name: 'Canopy Growth',
      description: 'Vanilla',
      strainType: 'Sativa',
      thcRange: '18%',
      location: 'Quebec (10 Kilometer)',
      imageUrl: '../../../../../assets/product/product.png',
      posted: '2 Days ago'
    },
    {
      name: 'Canopy Growth',
      description: 'Vanilla',
      strainType: 'Sativa',
      thcRange: '18%',
      location: 'Quebec (10 Kilometer)',
      imageUrl: '../../../../../assets/product/product.png',
      posted: '2 Days ago'
    },
    // Add more products as needed
  ];

  ngOnInit(): void {
    console.log(this.products.length < 0)
  }
}
