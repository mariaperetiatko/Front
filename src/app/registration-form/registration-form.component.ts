import { Component, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { RegistrationViewModel } from '../api.service';
import { UserService } from '../user.service';
import { finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})

export class RegistrationFormComponent implements OnInit  {
  isRequesting: boolean;
  submitted = false;
  registrations: RegistrationViewModel = new RegistrationViewModel({
    email: '',
    password: '',
    birthday: new Date(),
    firstName: '',
    lastName: '',
    phone: '',
    passportNumber: 0,
    role: 'member'
  });

  closeResult = '';
  modalRef = '';

  @ViewChild('content') templateRef: TemplateRef<any>;

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute,
     private modalService: NgbModal) { }

  ngOnInit() {
  }

  selectChangeHandler (event: any) {
    this.registrations.role = event.target.value;
  }

  registerUser() {
        this.userService.register(this.registrations.email, this.registrations.password, this.registrations.firstName,
          this.registrations.lastName, this.registrations.phone, this.registrations.birthday, this.registrations.role)
                  .pipe(finalize(() => this.isRequesting = false), catchError(this.handleError))
                  .subscribe(
                    result  => {if (result) {
                        this.router.navigate(['/login'], {queryParams: {email: this.registrations.email}});
                    }});
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
    this.modalService.open(this.templateRef, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
 }
