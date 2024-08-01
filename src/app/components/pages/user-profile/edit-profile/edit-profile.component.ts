import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User, UserDetails } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  selectedLicense: File[] = [];
  ingredient: string = 'yes';

  profileForm!: FormGroup;
  formData = new FormData();
  user!: UserDetails;
  loading:boolean=false;


  @ViewChildren('section') sections!: QueryList<ElementRef>;


  constructor(private fb: FormBuilder, private userService: UserService,private router:Router) {

  }
  ngOnInit(): void {

    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone_no: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      avatar: [null, Validators.required]

    });

    this.fetchProfileData();

  }
  fetchProfileData(): void {
    //get user details
    this.user = this.userService.currentUser.user;
    console.log(this.user);

    const profileData = {
      name: this.user.name,
      phone_no: this.user.phone_no,
      avatar:this.user.avatar
    };

    this.profileForm.patchValue({
      name: profileData.name,
      phone_no: profileData.phone_no,
      avatar:profileData.avatar
    });
  }

  updateProfile() {
    this.loading=true;

    const formData = new FormData();

    formData.append('name', this.profileForm.get('name')!.value);
    formData.append('phone_no', this.profileForm.get('phone_no')!.value);
    formData.append('avatar', this.profileForm.get('avatar')!.value);
    // console.log(this.profileForm);

    this.userService.updateUserProfile(formData).subscribe({
      next:(response)=>{
        console.log(response);
        this.loading=false;
        this.router.navigate(['/profile/profile-details']);
      },error:(err)=>{
        console.log(err);
        this.loading=false;
      }
    });

  }
  notUpdateProfile() {
    const profileData = {
      name: this.user.name,
      phone_no: this.user.phone_no,
      avatar:this.user.avatar
    };

    this.profileForm.patchValue({
      name: profileData.name,
      phone_no: profileData.phone_no,
      avatar:profileData.avatar
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
    }
  }

  onSelectLicense(event: Event) {
    console.log(event);
    const files: FileList | null = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      console.log(fileArray);
      this.selectedLicense = [...fileArray];
    }
  }
  onRemoveLicense() {
    this.selectedLicense = [];
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
