import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { BlockUIModule } from 'primeng/blockui';
import { PanelModule } from 'primeng/panel';
import { ChatDatePipe } from '../pipe/chat-date.pipe';


@NgModule({
  declarations: [ChatDatePipe],
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
    BlockUIModule,
    PanelModule,
    ToastrModule.forRoot(),
  ],
  providers:[
    DatePipe
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
    BlockUIModule,
    PanelModule,
    InputNumberModule,
    ChatDatePipe
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
