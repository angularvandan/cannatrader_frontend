import { Component } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  user!: User;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.userObservable.subscribe(newUser => {
      this.user = newUser;
    });
  }
  get isAuth() {
    return this.user.token;
  }

}
