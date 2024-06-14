import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SubscribedDetailsComponent } from './subscribed-details/subscribed-details.component';
import { RecentProductListingComponent } from './recent-product-listing/recent-product-listing.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { UserProfileRoutingModule } from './user-profile.routing.module';



@NgModule({
  declarations: [
    ProfileDetailsComponent,
    EditProfileComponent,
    SubscribedDetailsComponent,
    RecentProductListingComponent,
    EditProductComponent
  ],
  imports: [
    CommonModule,
    UserProfileRoutingModule
  ]
})
export class UserProfileModule { }
