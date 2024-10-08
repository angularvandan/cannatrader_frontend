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
import { RatingModule } from 'primeng/rating';
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
    
    RatingModule,
    DropdownModule,
    InputNumberModule,
    BlockUIModule,
    PanelModule,
    ],
  providers:[
    DatePipe,

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
    RatingModule,
    BlockUIModule,
    PanelModule,
    InputNumberModule,
    ChatDatePipe
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
