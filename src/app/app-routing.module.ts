import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', loadChildren: () => import('./components/pages/user-auth/user-auth.module').then(m => m.UserAuthModule)
  },
  {
    path: 'products', loadChildren: () => import('./components/pages/product/product.module').then(m => m.ProductModule)
  },
  {
    path: 'profile', loadChildren: () => import('./components/pages/user-profile/user-profile.module').then(m => m.UserProfileModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
