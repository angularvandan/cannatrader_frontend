import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserAuthRoutingModule } from './user-auth-routing.module';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    SharedModule,
    UserAuthRoutingModule,
    NgxIntlTelInputModule,
    
  ]
})
export class UserAuthModule { }
