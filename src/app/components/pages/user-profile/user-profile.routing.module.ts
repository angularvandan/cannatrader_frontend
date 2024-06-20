import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecentProductListingComponent } from './recent-product-listing/recent-product-listing.component';
import { EditProductComponent } from './edit-product/edit-product.component';

const routes: Routes = [
    {
        path: 'recentlisting', component: RecentProductListingComponent
    },
    {
        path: 'editProduct', component: EditProductComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserProfileRoutingModule { }
