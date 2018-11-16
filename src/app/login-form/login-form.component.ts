import { Component, OnInit, OnDestroy } from '@angular/core';
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

export class LoginFormComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  brandNew: boolean;
  errors: string;
  isRequesting: boolean;
  submitted = false;
  credentials: CredentialsViewModel = new CredentialsViewModel({userName: '', password: ''});

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {

    // subscribe to router event
    /*this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {
         this.brandNew = param['brandNew'];
         this.credentials.userName = param['email'];
      });*/
    }
      ngOnDestroy() {
        // prevent memory leak by unsubscribing
        // this.subscription.unsubscribe();
      }

      login() {
        alert(this.router);
        this.submitted = true;
        this.isRequesting = true;
        this.errors = '';
        // if (valid) {
          alert('hfhfhf');
          this.userService.login(this.credentials.userName, this.credentials.password)
            .pipe(finalize(() => this.isRequesting = false)).
            subscribe(
            result => {
              if (result) {
                alert('ggggggggggggggggggggggggg');
                window.location.reload();
                this.router.navigate(['/map']);
              }
            },
            error => this.errors = error);
        }
      }
    // }


