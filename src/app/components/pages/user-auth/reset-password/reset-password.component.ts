import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements AfterViewInit, OnInit ,OnDestroy{

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  loading: boolean = false;
  section: string = 'sendEmail';

  resetPasswordForm!: FormGroup;
  updatePasswordForm!: FormGroup;
  userId!: string;

  loadingOtp: boolean = false;
  validTimeForOtpStatus: boolean = true;

  timeLeft: number = 120; // Time in seconds (2 minutes)
  timerSubscription!: Subscription;

  constructor(private fb: FormBuilder, private userService: UserService, private tostr: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.updatePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
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

    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Only allow numeric values and clear input if non-numeric
    if (!/^[0-9]*$/.test(value)) {
      input.value = value.replace(/[^0-9]/g, '');
    }


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
      setTimeout(() => {
        inputs[index - 1].nativeElement.focus();
      }, 0)
    }
  }

  submit(section: string) {

    this.loading = true;
    if (this.resetPasswordForm.valid) {

      this.getOtpOnEmail(section);
    }
    else {
      this.resetPasswordForm.markAllAsTouched();
      this.loading = false;
    }
  }
  getOtpOnEmail(section: string) {
    const email = this.resetPasswordForm.get('email')?.value.toLowerCase();
    // console.log(email);
    this.loadingOtp = true;
    this.userService.resetPassword(email).subscribe({
      next: (respose) => {
        // console.log(respose);
        this.loadingOtp = false;
        this.loading = false;
        this.section = section;

        this.tostr.success(respose.message);
        // Start the countdown
        this.timeLeft=120;
        this.timerSubscription = interval(1000).subscribe(() => {
          this.updateTimer();
        });
      }, error: (err) => {
        // console.log(err);
        this.loadingOtp = false;
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
      email: this.resetPasswordForm.value.email.toLowerCase()
    }
    // console.log(payloadForOtp);

    this.userService.verifyOtpForResetPassword(payloadForOtp).subscribe({
      next: (response) => {
        // console.log(response);

        this.section = section;
        this.tostr.success(response.message);
        this.loading = false;

        this.userId = response.userId;

      }, error: (err) => {

        this.loading = false;
        this.tostr.error(err.error.error.message);
      }
    })

  }
  updateTimer(): void {
    if (this.timeLeft > 0) {
      this.timeLeft--;
    } else {
      // Stop the timer when it reaches 0
      this.timerSubscription.unsubscribe();
    }
  }
  getFormattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  changePassword() {
    if (this.updatePasswordForm.valid) {
      this.loading = true;
      const newPassword = this.updatePasswordForm.get('newPassword')?.value;
      const confirmPassword = this.updatePasswordForm.get('confirmPassword')?.value;

      this.userService.updatePassword(this.userId, newPassword, confirmPassword).subscribe({
        next: (response) => {
          this.tostr.success(response.message);
          this.loading = false;
          this.router.navigate(['/login']);

        }, error: (err) => {
          this.loading = false;
          this.tostr.error(err.error.message);
        }
      });
    }
    else {
      this.updatePasswordForm.markAllAsTouched();
    }
  }
  ngOnDestroy(): void {
    // Clean up the subscription when the component is destroyed
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
