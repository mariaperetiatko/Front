import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { RegistrationViewModel } from '../api.service';
import { UserService } from '../user.service';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit {
  isRequesting: boolean;
  submitted = false;
  registrations: RegistrationViewModel = new RegistrationViewModel({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: 0,
    role: ''
  });

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  registerUser() {

        this.userService.register(this.registrations.email, this.registrations.password, this.registrations.firstName,
          this.registrations.lastName, this.registrations.phone, this.registrations.role)
                  .pipe(finalize(() => this.isRequesting = false))
                  .subscribe(
                    result  => {if (result) {
                        this.router.navigate(['/login'], {queryParams: {email: this.registrations.email}});
                    }});
    }
 }
