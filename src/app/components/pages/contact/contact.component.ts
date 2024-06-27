import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhoneNumberFormat, SearchCountryField, CountryISO } from 'ngx-intl-tel-input';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  phoneForm!: FormGroup;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
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
