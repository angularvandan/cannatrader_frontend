import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FileUploadModule } from 'primeng/fileupload'
import { HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { RatingModule } from 'primeng/rating';
import { ToastrModule } from 'ngx-toastr';
import { InputNumberModule } from 'primeng/inputnumber';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FileUploadModule,
    HttpClientModule,
    DropdownModule,
    CalendarModule,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    ConfirmDialogModule,
    ToastModule,
    RatingModule,
    DropdownModule,
    InputNumberModule,
    ToastrModule.forRoot(),
  ],
  exports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FileUploadModule,
    HttpClientModule,
    CalendarModule,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    SidebarModule,
    ConfirmDialogModule,
    ToastModule,
    RatingModule,
    ToastrModule,
    InputNumberModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
