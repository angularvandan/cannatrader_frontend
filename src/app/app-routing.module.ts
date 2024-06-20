import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { AddProductComponent } from './components/pages/add-product/add-product.component';
import { TermsConditionsComponent } from './components/pages/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './components/pages/privacy-policy/privacy-policy.component';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./components/pages/user-auth/user-auth.module').then(m => m.UserAuthModule)
  },
  {
    path: 'products', loadChildren: () => import('./components/pages/product/product.module').then(m => m.ProductModule)
  },
  {
    path: 'addProduct', component: AddProductComponent
  },
  {
    path: 'profile', loadChildren: () => import('./components/pages/user-profile/user-profile.module').then(m => m.UserProfileModule)
  },
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'terms-conditions', component: TermsConditionsComponent
  },
  {
    path: 'privacy-policy', component: PrivacyPolicyComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
