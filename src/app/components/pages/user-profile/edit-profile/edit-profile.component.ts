import { Component, ElementRef, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User, UserDetails } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  selectedLicense: File[] = [];

  profileForm!: FormGroup;
  formData = new FormData();
  user!: UserDetails;//with this user data also updated in local storage

  loadingForProfile: boolean = false;
  loadingForCompany: boolean = false;
  loadingForPassword: boolean = false;

  radioForm!: FormGroup;

  companyForm!: FormGroup;
  showCompanyForm: boolean = true;
  companyInfo: any = {};

  passwordForm!: FormGroup;


  @ViewChildren('section') sections!: QueryList<ElementRef>;


  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private tostr: ToastrService) {

  }

  ngOnInit(): void {

    this.getCompanyInfo();

    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone_no: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      avatar: [null, Validators.required]

    });
    this.fetchProfileData();

    //for show companny or not
    this.radioForm = this.fb.group({
      companyDecision: ['yes']
    });

    this.radioForm.get('companyDecision')?.valueChanges.subscribe(value => {
      this.showCompanyForm = value === 'yes';
      console.log(this.radioForm);

    });

    //this is for company info
    this.companyForm = this.fb.group({
      company_name: ['', Validators.required],
      business_type: ['', Validators.required],
      contact_no: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      business_id_no: ['', Validators.required],
      location: ['', Validators.required],
      latitude: ['2312322', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      longitude: ['123123', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      pdf: [null, Validators.required]
    });
    //this is for change password
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });

  }
  fetchProfileData(): void {
    //get user details
    this.user = this.userService.currentUser.user;

    const profileData = {
      name: this.user.name,
      phone_no: this.user.phone_no,
      avatar: this.user.avatar
    };

    this.profileForm.patchValue({
      name: profileData.name,
      phone_no: profileData.phone_no,
      avatar: profileData.avatar
    });
  }

  updateProfile() {
    this.loadingForProfile = true;

    const formData = new FormData();

    formData.append('name', this.profileForm.get('name')!.value);
    formData.append('phone_no', this.profileForm.get('phone_no')!.value);
    formData.append('avatar', this.profileForm.get('avatar')!.value);
    // console.log(this.profileForm);
    this.updateProfileApiCall(formData);

  }
  updateProfileApiCall(formData: FormData) {
    this.userService.updateUserProfile(formData).subscribe({
      next: (response) => {
        console.log(response);
        this.loadingForProfile = false;
        this.tostr.success(response.message);
        this.getUpdatedProfile();
      }, error: (err) => {
        console.log(err);
        this.loadingForProfile = false;
        this.tostr.error(err.error.error.message);
      }
    });
  }
  //after update formfile get updated profile
  getUpdatedProfile() {
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        this.user = response.user;
        console.log(this.user);
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  notUpdateProfile() {
    const profileData = {
      name: this.user.name,
      phone_no: this.user.phone_no,
      avatar: this.user.avatar
    };

    this.profileForm.patchValue({
      name: profileData.name,
      phone_no: profileData.phone_no,
      avatar: profileData.avatar
    });
    // console.log(this.profileForm);
  }


  onFileSelectedForUserImage(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Selected file:', file);

      this.profileForm.patchValue({
        avatar: file
      });
      this.profileForm.get('avatar')!.updateValueAndValidity();
      this.updateProfile();
    }
  }

  //for company
  onCompanyDocUpdateSave() {
    if (this.companyInfo.pdf) {
      this.updateCompayInfo();
    }
    else {
      this.loadingForCompany = true;

      const formData = new FormData();

      formData.append('company_name', this.companyForm.get('company_name')?.value);
      formData.append('business_type', this.companyForm.get('business_type')?.value);
      formData.append('contact_no', this.companyForm.get('contact_no')?.value);
      formData.append('business_id_no', this.companyForm.get('business_id_no')?.value);
      formData.append('location', this.companyForm.get('location')?.value);
      formData.append('latitude', this.companyForm.get('latitude')?.value);
      formData.append('longitude', this.companyForm.get('longitude')?.value);
      formData.append('pdf', this.companyForm.get('pdf')?.value);

      console.log(this.companyForm);

      this.userService.registerCompany(formData).subscribe({
        next: (response) => {
          console.log(response);
          this.loadingForCompany = false;
          this.tostr.success('Company Details has Saved.')
        }, error: (err) => {
          this.tostr.error(err.error.error.message);
          this.loadingForCompany = false;
          console.log(err);
        }
      })

    }

  }
  //this is for update company info
  private updateCompayInfo() {
    this.loadingForCompany=true;

    this.companyInfo = {
      company_name: this.companyForm.get('company_name')?.value,
      business_type: this.companyForm.get('business_type')?.value,
      contact_no: this.companyForm.get('contact_no')?.value,
      business_id_no: this.companyForm.get('business_id_no')?.value,
      location: 'patna',
      pdf: this.companyForm.get('pdf')?.value,
    }

    this.userService.updateCompany(this.companyInfo).subscribe({
      next:(response)=>{
        console.log(response);
        this.loadingForCompany=false;

        this.tostr.success('Updated Successfully');
      },error:(err)=>{
        console.log(err.error.error.message);
        this.loadingForCompany=false;

      }
    })
  }
  //this is for patch the value of company
  getCompanyInfo() {
    this.userService.getRegisterCompany().subscribe({
      next: (response) => {
        console.log(response);
        this.companyInfo = {
          company_name: response.company.company_name,
          business_type: response.company.business_type,
          contact_no: response.company.contact_no,
          business_id_no: response.company.business_id_no,
          location: 'patna',
          pdf: response.company.health_license,
        }

        this.companyForm.patchValue(this.companyInfo);
        this.preloadFile();

      }, error: (err) => {
        console.log(err);
      }
    });
  }
  //this is for patch value of file
  preloadFile() {
    this.selectedLicense = [];
    const blob = new Blob(['file content'], { type: 'application/pdf' });
    const file = new File([blob], this.companyInfo.pdf, { type: 'application/pdf' });
    this.companyForm.patchValue({
      pdf: file
    });
    this.selectedLicense.push(file);
  }
  //this is for select file
  onSelectLicense(event: Event) {
    console.log(event);
    const files: FileList | null = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      console.log(fileArray);
      this.selectedLicense = [...fileArray];

      this.companyForm.patchValue({
        pdf: this.selectedLicense[0]
      });
      this.companyForm.get('pdf')!.updateValueAndValidity();
    }
  }
  //this is for removve file
  onRemoveLicense() {
    this.selectedLicense = [];
    this.companyForm.patchValue({
      pdf: this.selectedLicense[0]
    });
  }
  onCancleUpdateCompany() {
    this.companyForm.patchValue(this.companyInfo);
    this.preloadFile();
  }

  //for change passowrd
  onChangePassword() {
    this.loadingForPassword = true;

    console.log(this.passwordForm.value);
    if (this.passwordForm.valid) {
      this.userService.changePassword(this.passwordForm.value).subscribe({
        next: (response) => {
          this.loadingForPassword = false;
          this.tostr.success(response.message)
        },
        error: (err) => {
          this.loadingForPassword = false;
          this.tostr.error(err.error.error.message);
        }
      })
    }
  }
  onCanclePassword() {
    this.passwordForm.reset();
  }

  scrollToSection(sectionName: string) {
    const sectionEle = this.sections.find(el => el.nativeElement.id == sectionName);
    console.log(sectionName);
    console.log(this.sections);
    if (sectionEle) {
      sectionEle.nativeElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

}
