import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { WishlistComponent } from '../wishlist/wishlist.component';

const routes: Routes = [
    {
        path: '', component: RegisterComponent
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'reset-password', component: ResetPasswordComponent
    },
    {
        path: 'wishlist', component: WishlistComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserAuthRoutingModule { }
