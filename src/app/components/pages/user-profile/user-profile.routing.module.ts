import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecentProductListingComponent } from './recent-product-listing/recent-product-listing.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { SubscribedDetailsComponent } from './subscribed-details/subscribed-details.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

const routes: Routes = [
    {
        path:'',component:ProfileDetailsComponent,
    },
    {
        path:'profile-details',component:ProfileDetailsComponent
    },
    {
        path: 'recentlisting', component: RecentProductListingComponent
    },
    {
        path: 'editProduct', component: EditProductComponent
    },
    {
        path: 'subscribed-listing', component: SubscribedDetailsComponent
    },
    {
        path: 'edit-profile', component: EditProfileComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserProfileRoutingModule { }
