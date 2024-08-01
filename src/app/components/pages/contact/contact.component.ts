import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  phoneForm!: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.phoneForm = this.fb.group({
      phone: [undefined, [Validators.required]]
    });
  }

  onSubmit() {
    if (this.phoneForm.valid) {
      console.log(this.phoneForm.value);
    }
  }
}
