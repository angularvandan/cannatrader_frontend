import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;
  loading: boolean = false;


  constructor(private userService:UserService,private fb: FormBuilder,private tostr: ToastrService,private router:Router,){}


  ngOnInit(): void {
    if(this.userService.currentUser.token){
      this.router.navigate(['/home']);
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onLogin(){
    this.loading=true;

    if (this.loginForm.valid) {
      console.log(this.loginForm.value);

      this.userService.login(this.loginForm.value).subscribe((res:any)=>{
        this.loading=true;
        this.router.navigate(['/home']);

      });
    }

  }
}
