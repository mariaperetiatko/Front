import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { CredentialsViewModel } from '../api.service';
import { UserService } from '../user.service';

import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})

export class LoginFormComponent implements OnInit {

  private subscription: Subscription;
  brandNew: boolean;
  errors: string;
  isRequesting: boolean;
  submitted = false;
  credentials: CredentialsViewModel = new CredentialsViewModel({userName: '', password: ''});

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
      const redirect = localStorage.getItem('redirect');
      if (redirect !== '') {
        this.router.navigate([redirect]);
      }
    }


      login() {
        this.submitted = true;
        this.isRequesting = true;
        this.errors = '';
        // if (valid) {
          this.userService.login(this.credentials.userName, this.credentials.password)
            .pipe(finalize(() => {
              this.isRequesting = false;
            })).
            subscribe(
            result => {
              if (result) {
                const isMember = (localStorage.getItem('role') === 'Member');
                const isAdmin = (localStorage.getItem('role') === 'Admin');
                if (isMember) {
                  localStorage.setItem('redirect', '/home');
                } else {
                  localStorage.setItem('redirect', '/clients-admin');
                }
                window.location.reload();
              }
            },
            error => this.errors = error);
        }
      }
