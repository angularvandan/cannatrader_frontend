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
  selectedFile: File | null = null;
  section: string = '';
  loading: boolean = false;

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;


  constructor(private router: Router, private fb: FormBuilder, private userService: UserService, private tostr: ToastrService) { }

  registerForm!: FormGroup;
  formData = new FormData();


  ngOnInit(): void {

    if(this.userService.currentUser.token){
      this.router.navigate(['/home']);
    }

    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_no: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      pdf: [null],
      termsAccepted: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'passwordMismatch': true };
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
      inputs[index + 1].nativeElement.focus();
    }
  }
  handleKeyDown(event: KeyboardEvent, index: number): void {

    const inputs = this.otpInputs.toArray();
    // console.log(inputs);

    if (event.key === 'Backspace' && index !== 0) {
      inputs[index].nativeElement.value = '';
      inputs[index - 1].nativeElement.focus();
    }
  }
  verifyEmail() {
    this.loading = true;
    const inputs = this.otpInputs.toArray();
    let otpString = ''
    for (let i = 0; i < 4; i++) {
      otpString += inputs[i].nativeElement.value;
    }
    const payloadForOtp = {
      otp: otpString,
      email: this.registerForm.value.email
    }

    this.userService.verifyOtpForEmail(payloadForOtp).subscribe({
      next: (response: any) => {

        // console.log(response);
        this.loading = false;
        this.router.navigate(['/login']);
        this.tostr.success("Email Verifyed Successfully");

      }, error: (err: any) => {
        this.loading = false;
        this.tostr.error(err.error.error.message);

      }
    });

  }

  onSignup() {
    this.loading = true;
    // console.log(this.registerForm.value.email.toLowerCase());


    if (this.registerForm.valid) {
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
          this.tostr.success("Register Successfully");
          // this.router.navigate(['/login']);
          this.section = 'otp';

        },
        error: (err) => {
          this.loading = false;
          this.formData = new FormData();

          this.onAppendMethodFile(this.selectedFile);
          this.tostr.error(err.error.error.message);

        }
      });
    }
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.onAppendMethodFile(this.selectedFile);
    }
  }
  
  onAppendMethodFile(selectedFile: any) {
    
    this.formData.append('pdf', selectedFile);
    // console.log(this.formData);
    this.registerForm.patchValue({ pdf: selectedFile });
  }

  removeFile(): void {
    this.selectedFile = null;
    this.registerForm.patchValue({ pdf: this.selectedFile });
  }

}
