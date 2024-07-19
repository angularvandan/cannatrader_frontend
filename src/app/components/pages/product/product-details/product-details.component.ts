import { Component } from '@angular/core';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  value: number = 4;
  rate: number = 0

  btn = true
  paragraph: string = `Our premium cannabis dried flower is cultivated from top-quality strains, ensuring a potent and aromatic
                experience Our premium cannabis dried flower is cultivated from top-quality strains, ensuring `;
  charLimit: number = 100;
  showAll: boolean = false;
  
  toggleBtn() {
    this.btn = !this.btn
  }

  toggleViewMore() {
    this.showAll = !this.showAll;
  }
}
