import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecentProductListingComponent } from './recent-product-listing/recent-product-listing.component';

const routes: Routes = [
    {
        path: 'recentlisting', component: RecentProductListingComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserProfileRoutingModule { }
