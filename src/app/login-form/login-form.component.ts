import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { CredentialsViewModel } from '../api.service';
import { UserService } from '../user.service';

import { finalize } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


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

  @ViewChild('content') templateRef: TemplateRef<any>;

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute,
    private modalService: NgbModal) { }

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
        }), catchError(this.handleError)).
        subscribe(
          result => {
            if (result) {
              const isMember = (localStorage.getItem('role') === 'Member');
              const isAdmin = (localStorage.getItem('role') === 'Admin');
              const isLandlord = (localStorage.getItem('role') === 'RestaurantOwner');
              if (isMember) {
                localStorage.setItem('redirect', '/home');
              } else if (isLandlord){
                localStorage.setItem('redirect', '/home-landlord');
              } else {
                localStorage.setItem('redirect', '/clients-admin');

              }
              window.location.reload();
            }
          },
          error => this.errors = error);
  }


  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {

    // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    const element: HTMLElement = document.getElementById('myDiv') as HTMLElement;
    element.click();
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  open() {
    console.log(this.templateRef);
    this.modalService.open(this.templateRef, {ariaLabelledBy: 'modal-basic-title'});
  }
}
