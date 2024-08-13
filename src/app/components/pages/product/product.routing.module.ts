import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListingComponent } from './product-listing/product-listing.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ChatDetailsComponent } from './chat-details/chat-details.component';

const routes: Routes = [
    {
        path: '', component: ProductListingComponent
    },
    {
        path: 'productDetails/:id', component: ProductDetailsComponent
    },
    {
        path: 'chats', component: ChatDetailsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductRoutingModule { }
