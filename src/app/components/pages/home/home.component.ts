import { Component, OnInit } from '@angular/core';

interface Dropdown {
  name: string;
  code: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  strainTypes!: Dropdown[];
  selectedCity: Dropdown = { name: '--Select Strain Type--', code: 'none' };

  selectedCategories = { name: '--Select Category--', code: 'none' }
  categories!: Dropdown[]

  subCategories!: Dropdown[]
  selectedsubCategories: Dropdown = { name: '--Select SubCategories--', code: 'none' }

  thcRange!: Dropdown[]
  selectedThcRange: Dropdown = { name: '--Select THC range--', code: 'none' }

  searchWithin!: Dropdown[]
  selectedSearchWithin: Dropdown = { name: '--Select (km)--', code: 'none' }
  ngOnInit() {
    this.strainTypes = [
      { name: 'Indica', code: 'Indica' },
      { name: 'Sativa', code: 'Sativa' },
      { name: 'Hybrid', code: 'Hybrid' },
    ];

    this.categories = [
      { name: 'Flower', code: 'Flower' },
      { name: 'Bio mass', code: 'Bio mass' },
      { name: 'Hemp', code: 'Hemp' },
      { name: 'Fresh frozen', code: 'Fresh frozen' },
      { name: 'Genetics', code: 'Genetics' },
      { name: 'Extracts-concentrates', code: 'Extracts-concentrates' },
      { name: 'Edibles', code: 'Edibles' },
      { name: 'Topicals', code: 'Topicals' },
      { name: 'Services', code: 'Services' },
      { name: 'Materials', code: 'Materials' },
      { name: 'Equipments', code: 'Equipments' }
    ];

    this.subCategories = [
      { name: 'Clones', code: '' },
      { name: 'Teens', code: 'Teens' },
      { name: 'Mothers', code: 'Mothers' },
      { name: 'Seeds', code: 'Seeds' },
    ];

    this.thcRange = [
      { name: '0 - 10%', code: '0 - 10%' },
      { name: '10 - 20%', code: '10 - 20%' },
      { name: '20 - 30%', code: '20 - 30%' },
      { name: '30% Plus', code: '30% Plus' },
    ];

    this.searchWithin = [
      { name: '5Km', code: '5Km' },
      { name: '10Km', code: '10Km' },
      { name: '15Km', code: '15Km' },
      { name: '20Km', code: '20Km' },
    ];

  }

}
