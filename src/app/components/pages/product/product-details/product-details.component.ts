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

  toggleBtn() {
    this.btn = !this.btn
  }
}
