import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  selectedFile: File | null = null;
  section:string='';
  loading:boolean=false;
  
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;


  constructor(private router:Router){}
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
  verifyEmail() {
    this.loading = true
    setTimeout(() => {
      // this.attachEventListeners();
      this.loading = false;
      this.router.navigate(['/login'])
    }, 3000);
  }

  onSignup(){
    this.section='otp';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  removeFile(): void {
    this.selectedFile = null;
  }

}
