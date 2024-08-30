import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ContactComponent } from './components/partials/contact/contact.component';
import { WishlistComponent } from './components/pages/wishlist/wishlist.component';
import { AddProductComponent } from './components/pages/add-product/add-product.component';
import { HeaderComponent } from './components/partials/header/header.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../app/shared/shared/shared.module';
import { PrivacyPolicyComponent } from './components/partials/privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './components/partials/terms-conditions/terms-conditions.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './shared/interceptors/token.interceptor';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactComponent,
    WishlistComponent,
    AddProductComponent,
    HeaderComponent,
    FooterComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    FormsModule,
    BrowserAnimationsModule,
    SharedModule,
    DropdownModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
