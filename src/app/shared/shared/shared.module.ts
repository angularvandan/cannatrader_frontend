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
    RatingModule
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
    RatingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
