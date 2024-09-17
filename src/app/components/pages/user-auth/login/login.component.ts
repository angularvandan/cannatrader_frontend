import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loading: boolean = false;


  constructor(private userService: UserService, private fb: FormBuilder, private router: Router, private messageService: MessageService) { }


  ngOnInit(): void {
    if (this.userService.currentUser.token) {
      this.router.navigate(['/home']);
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onLogin() {

    if (this.loginForm.valid) {
      this.loading = true;
      console.log(this.loginForm.value);

      let payload = { email: this.loginForm.value.email.toLowerCase(), password: this.loginForm.value.password }

      this.userService.login(payload).subscribe({
        next: (res) => {
          this.loading = true;

          this.messageService.add({ severity: 'success', summary: 'Login Successfully', detail: res.user.name });
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1500);
        }, error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error.message });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
          this.loading = false;

        }
      });
    }
    else {
      this.loginForm.markAllAsTouched();
    }

  }
}
