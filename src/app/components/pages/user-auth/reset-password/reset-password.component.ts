import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements AfterViewInit, OnInit {

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  loading: boolean = false;
  section: string = 'sendEmail';

  resetPasswordForm!: FormGroup;
  updatePasswordForm!: FormGroup;
  userId!:string;

  constructor(private fb: FormBuilder, private userService: UserService, private tostr: ToastrService,private router:Router) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.updatePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngAfterViewInit() {
    this.attachEventListeners();
  }
  passwordMatchValidator(form: FormGroup): { [s: string]: boolean } | null {
    if (form.get('newPassword')?.value !== form.get('confirmPassword')?.value) {
      return { 'mismatch': true };
    }
    return null;
  }

  attachEventListeners() {
    this.otpInputs.forEach((input, index) => {
      const nativeElement = input.nativeElement;
      nativeElement.removeEventListener('input', (event: Event) => this.handleInput(event, index));
      nativeElement.addEventListener('input', (event: Event) => this.handleInput(event, index));
    });
  }

  handleInput(event: Event, index: number): void {
    const inputs = this.otpInputs.toArray();
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length === 1 && index < inputs.length - 1) {
      inputs[index + 1].nativeElement.focus();
    }
  }

  handleKeyDown(event: KeyboardEvent, index: number): void {
    const inputs = this.otpInputs.toArray();
    if (event.key === 'Backspace' && index !== 0) {
      inputs[index].nativeElement.value = '';
      inputs[index - 1].nativeElement.focus();
    }
  }

  submit(section: string) {

    this.loading = true;
    if (this.resetPasswordForm.valid) {

      this.getOtpOnEmail(section);
    }
  }
  getOtpOnEmail(section: string) {
    const email = this.resetPasswordForm.get('email')?.value.toLowerCase();
    // console.log(email);

    this.userService.resetPassword(email).subscribe({
      next: (respose) => {

        // console.log(respose);
        this.loading = false;
        this.section = section;

        this.tostr.success(respose.message);
      }, error: (err) => {
        // console.log(err);
        this.loading = false;
        this.tostr.error(err.error.error.message);
      }
    });
  }

  verifyOtp(section: string) {
    this.loading = true;
    const inputs = this.otpInputs.toArray();
    let otpString = ''
    for (let i = 0; i < 4; i++) {
      otpString += inputs[i].nativeElement.value;
    }
    const payloadForOtp = {
      otp: otpString,
      email: this.resetPasswordForm.value.email
    }
    // console.log(payloadForOtp);

    this.userService.verifyOtpForResetPassword(payloadForOtp).subscribe({
      next:(response)=>{
        // console.log(response);
        
        this.section=section;
        this.tostr.success(response.message);
        this.loading = false;

        this.userId=response.userId;

      },error:(err)=>{
        
        this.loading = false;
        this.tostr.error(err.error.error.message);
      }
    })

  }
  changePassword(){
    this.loading=true;
    if (this.updatePasswordForm.valid) {
      const newPassword = this.updatePasswordForm.get('newPassword')?.value;
      const confirmPassword = this.updatePasswordForm.get('confirmPassword')?.value;

      this.userService.updatePassword(this.userId, newPassword, confirmPassword).subscribe({
        next:(response)=>{
          this.tostr.success(response.message);
          this.loading=false;
          this.router.navigate(['/login']);
          
        },error:(err)=>{
          this.loading=false;
          this.tostr.error(err.error.message);
        }
      });
    }
  }
}
