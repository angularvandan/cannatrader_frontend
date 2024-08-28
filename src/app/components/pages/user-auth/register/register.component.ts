import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements AfterViewInit, OnInit {
  section: string = '';
  loading: boolean = false;
  loadingOtp: boolean = false;

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;


  constructor(private router: Router, private fb: FormBuilder, private userService: UserService, private tostr: ToastrService) { }

  registerForm!: FormGroup;
  formData = new FormData();


  ngOnInit(): void {

    if (this.userService.currentUser.token) {
      this.router.navigate(['/home']);
    }

    this.registerForm = this.fb.group({
      name: ['', [Validators.required,Validators.pattern('^[A-Za-z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      phone_no: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });

    //this is for save data for future
    const savedData = JSON.parse(localStorage.getItem('signupFormData') || '{}');
    if (Object.keys(savedData).length) {
      this.registerForm.patchValue(savedData);
    }
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'passwordMismatch': true };
  }

  onPhoneInput(event: any): void {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^0-9]/g, ''); // Remove non-digits
    input.value = sanitized.slice(0, 10); // Limit to 10 digits
  }

  ngAfterViewInit() {
    this.attachEventListeners();

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
    // console.log(inputs);
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value.length === 1 && index < inputs.length - 1) {
      if (index != 3) {
        inputs[index + 1].nativeElement.focus();
      }
    }
  }
  handleKeyDown(event: KeyboardEvent, index: number): void {

    const inputs = this.otpInputs.toArray();
    console.log(index);

    if (event.key === 'Backspace' && index !== 0) {
      inputs[index].nativeElement.value = '';
      setTimeout(() => {
        inputs[index - 1].nativeElement.focus();

      }, 0)
    }
  }
  verifyEmail() {
    this.loadingOtp = true;
    const inputs = this.otpInputs.toArray();
    let otpString = ''
    for (let i = 0; i < 4; i++) {
      otpString += inputs[i].nativeElement.value;
    }
    const payloadForOtp = {
      otp: otpString,
      email: this.registerForm.value.email.toLowerCase()
    }
    console.log(payloadForOtp);

    this.userService.verifyOtpForEmail(payloadForOtp).subscribe({
      next: (response: any) => {

        // console.log(response);
        this.loadingOtp = false;
        this.router.navigate(['/login']);
        this.tostr.success("Email Verifyed Successfully");

      }, error: (err: any) => {
        this.loadingOtp = false;
        this.tostr.error(err.error.error.message);
        console.log(err);
      }
    });

  }
  resendOtpForVerifyEmail() {
    this.loading = true;
    console.log(this.registerForm.value.email.toLowerCase());
    this.userService.getOtpForEmailVerify({ email: this.registerForm.value.email.toLowerCase() }).subscribe({
      next: (response) => {
        console.log(response);
        this.tostr.success(response.message);
        this.loading = false;

      }, error: (err) => {
        // console.log(err);
        this.tostr.error(err.error.error.message);
        this.loading = false;

      }
    })
  }

  onSignup() {
    // console.log(this.registerForm.value.email.toLowerCase());


    if (this.registerForm.valid) {
      localStorage.removeItem('signupFormData');
      this.loading = true;
      this.formData.append('name', this.registerForm.value.name);
      this.formData.append('email', this.registerForm.value.email.toLowerCase());
      this.formData.append('password', this.registerForm.value.password);
      this.formData.append('phone_no', this.registerForm.value.phone_no);

      // console.log(this.formData);

      this.userService.register(this.formData).subscribe({
        next: (response: any) => {
          // console.log(response);
          this.formData = new FormData();

          this.loading = false;
          this.tostr.success(response.message);
          this.section = 'otp';

        },
        error: (err) => {

          this.loading = false;
          this.formData = new FormData();

          this.tostr.error(err.error.error.message);

        }
      });
    }
    else {
      this.registerForm.markAllAsTouched();
    }
  }

  onNavigateToPrivacyPolicyTermCondition(value: string) {
    localStorage.setItem('signupFormData', JSON.stringify(this.registerForm.value));
    // Navigate to privacy policy page
    if (value != 'terms-condition') {

      this.router.navigate(['/privacy-policy']);
    }
    else{

      this.router.navigate(['/terms-conditions']);
    }
  }

}
