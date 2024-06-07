import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListingComponent } from './product-listing/product-listing.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ChatDetailsComponent } from './chat-details/chat-details.component';



@NgModule({
  declarations: [
    ProductListingComponent,
    ProductDetailsComponent,
    ChatDetailsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ProductModule { }
