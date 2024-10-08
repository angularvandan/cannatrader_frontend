import { Component, ElementRef, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User, UserDetails } from 'src/app/shared/models/user';
import { ProductService } from 'src/app/shared/services/product.service';
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
  loadingForPdf:boolean=true;

  radioForm!: FormGroup;

  companyForm!: FormGroup;
  showCompanyForm: boolean = false;
  companyInfo: any = {};
  pdfDocName:string='';
  pdfLinksContainer:string='';

  passwordForm!: FormGroup;


  @ViewChildren('section') sections!: QueryList<ElementRef>;


  constructor(private fb: FormBuilder, private userService: UserService, private router: Router,private messageService:MessageService, private productService:ProductService) {

  }

  ngOnInit(): void {

    this.getCompanyInfo();

    this.profileForm = this.fb.group({
      name: ['', [Validators.required,Validators.pattern('^[A-Za-z ]+$')]],
      phone_no: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      avatar: [null, Validators.required]

    });
    this.fetchProfileData();

    //for show companny or not
    this.radioForm = this.fb.group({
      companyDecision: ['no']
    });

    this.radioForm.get('companyDecision')?.valueChanges.subscribe(value => {
      this.showCompanyForm = value === 'yes';
      console.log(this.radioForm);

    });

    //this is for company info
    this.companyForm = this.fb.group({
      company_name: ['', Validators.required],
      business_type: ['', Validators.required],
      contact_no: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
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

  onPhoneInput(event: any): void {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^0-9]/g, '');
    input.value = sanitized.slice(0, 10);
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
        this.messageService.add({severity:'success',summary:'Success',detail:response.message})
        this.getUpdatedProfile();
      }, error: (err) => {
        // console.log(err);
        this.loadingForProfile = false;
        this.messageService.add({severity:'error',summary:'Error',detail:err.error.error.message})
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

      this.userService.registerCompany(formData).subscribe({
        next: (response) => {
          console.log(response);
          this.loadingForCompany = false;
          this.messageService.add({severity:'success',summary:'Success',detail:'Company Details has Saved.'})

        }, error: (err) => {
          this.messageService.add({severity:'error',summary:'Error',detail:err.error.error.message})
          this.loadingForCompany = false;
        }
      })
    }
  }
  //this is for update company info
  private updateCompayInfo() {
    this.loadingForCompany=true;

    
    this.companyForm.patchValue({
      pdf:this.pdfLinksContainer
    });

    this.userService.updateCompany(this.companyForm.value).subscribe({
      next:(response)=>{
        console.log(response);
        this.loadingForCompany=false;
        this.messageService.add({severity:'success',summary:'Success',detail:'Updated Successfully'})

      },error:(err)=>{
        console.log(err);
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

        //radio for company info
        this.radioForm.patchValue({
          companyDecision:'yes'
        })

      }, error: (err) => {
        console.log(err);
        this.showCompanyForm=false;
        this.radioForm.patchValue({
          companyDecision:'no'
        })
      }
    });
  }
  //this is for patch value of file
  preloadFile() {

    this.pdfDocName=this.companyInfo.pdf.substring(this.companyInfo.pdf.lastIndexOf('/') + 1);
    this.pdfDocName=decodeURIComponent(this.pdfDocName).replace(/^\d+-/, '');
    // console.log(this.pdfDocName);
    this.pdfLinksContainer=this.companyInfo.pdf;
  }

  convertIntoPdfUrl(file:File){
    this.loadingForPdf=false;
    const formData=new FormData();
    formData.append('pdf',file);

    this.productService.pdfImageToPdfUrl(formData).subscribe({
      next:(response:any)=>{
        this.loadingForPdf=true;
        this.pdfLinksContainer=response.pdfUrl;
        this.pdfDocName=this.selectedLicense[0].name;
        // console.log(this.pdfLinksContainer);
      },error:(err)=>{
        console.log(err);
        this.loadingForPdf=true;
      }
    })
  }

  //this is for select file
  onSelectLicense(event: Event) {
    console.log(event);
    const files: FileList | null = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      //need to do blank for upload again  without close the pdf
      this.pdfDocName='';

      const fileArray = Array.from(files);
      // console.log(fileArray);
      this.selectedLicense = [...fileArray];
      //this is for update
      this.convertIntoPdfUrl(this.selectedLicense[0]);
      //this is for register
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
    this.pdfDocName='';
    this.pdfLinksContainer='';
  }
  onCancleUpdateCompany() {
    this.companyForm.patchValue(this.companyInfo);
    this.preloadFile();
  }

  //for change passowrd
  onChangePassword() {
    
    // console.log(this.passwordForm.value);
    if (this.passwordForm.valid) {
      this.loadingForPassword = true;
      this.userService.changePassword(this.passwordForm.value).subscribe({
        next: (response) => {
          this.loadingForPassword = false;
          this.messageService.add({severity:'success',summary:'Success',detail:response.message})
          this.passwordForm.reset();

        },
        error: (err) => {
          this.loadingForPassword = false;
          this.messageService.add({severity:'error',summary:'Error',detail:err.error.error.message})
        }
      })
    }
    else{
      this.passwordForm.markAllAsTouched();
    }
  }
  onCanclePassword() {
    this.passwordForm.reset();
  }

  scrollToSection(sectionName: string) {
    const sectionEle = this.sections.find(el => el.nativeElement.id == sectionName);
    // console.log(sectionName);
    // console.log(this.sections);
    if (sectionEle) {
      sectionEle.nativeElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }

}
