import { Component, AfterViewInit, ViewChildren, QueryList, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements AfterViewInit, OnInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  loading: boolean = false;
  section: string = 'sendEmail';

  ngOnInit(): void {

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
    this.loading = true
    setTimeout(() => {
      // this.attachEventListeners();
      this.loading = false
      this.section = section;
    }, 3000);
  }
}
