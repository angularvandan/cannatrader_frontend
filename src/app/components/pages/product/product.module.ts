import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListingComponent } from './product-listing/product-listing.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ChatDetailsComponent } from './chat-details/chat-details.component';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product.routing.module';
@NgModule({
  declarations: [
    ProductListingComponent,
    ProductDetailsComponent,
    ChatDetailsComponent,
  ],
  imports: [
    ProductRoutingModule,
    CommonModule,
    DropdownModule,
    MultiSelectModule,
    CardModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProductModule { }
