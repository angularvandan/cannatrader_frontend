import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactForm!: FormGroup;
  constructor(private fb: FormBuilder,private userService:UserService,private toastr:ToastrService) { }

  ngOnInit() {
    this.contactForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[a-zA-Z ]+$') 
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      phone_no: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]),
      message: new FormControl('', [
        Validators.required
      ])
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      this.userService.contactForm(this.contactForm.value).subscribe({
        next:(response:any)=>{
          this.toastr.success(response.message);
          this.contactForm.reset();
        },error:(err)=>{
          console.log(err);
        }
      })
    }
    else{
      this.contactForm.markAllAsTouched();
    }
  }
}
