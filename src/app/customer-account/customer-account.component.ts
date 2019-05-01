import { Component, OnInit } from '@angular/core';
import { APIClient, Client } from '../api.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-customer-account',
  templateUrl: './customer-account.component.html',
  styleUrls: ['./customer-account.component.css']
})
export class CustomerAccountComponent implements OnInit {

  client: Client;
  isRequesting: boolean;
  isFirstNameVisible = false;
  isLastNameVisible = false;
  isBirthdayVisible = false;
  isPassportNumberVisible = false;
  isPhoneVisible = false;
  isEmailVisible = false;

  constructor(private apiClient: APIClient, private router: Router,  private userService: UserService) {
       }

  ngOnInit() {
    this.getClient();
  }

  getClient(): void {
    this.isRequesting = true;

    this.apiClient.getClientById(0)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: Client) => this.client = data);
  }

  showHideFirstNameInput(): void {
    if (!this.isFirstNameVisible) {
      this.isFirstNameVisible = true;
    } else {
      this.isFirstNameVisible = false;
    }
  }

  showHideLastNameInput(): void {
    if (!this.isLastNameVisible) {
      this.isLastNameVisible = true;
    } else {
      this.isLastNameVisible = false;
    }
  }

  showHideBirthdayInput(): void {
    if (!this.isBirthdayVisible) {
      this.isBirthdayVisible = true;
    } else {
      this.isBirthdayVisible = false;
    }
  }

  showHidePassportNumberInput(): void {
    if (!this.isPassportNumberVisible) {
      this.isPassportNumberVisible = true;
    } else {
      this.isPassportNumberVisible = false;
    }
  }

  showHidePhoneInput(): void {
    if (!this.isPhoneVisible) {
      this.isPhoneVisible = true;
    } else {
      this.isPhoneVisible = false;
    }
  }


  showHideEmailInput(): void {
    if (!this.isEmailVisible) {
      this.isEmailVisible = true;
    } else {
      this.isEmailVisible = false;
    }
  }

  updateClient(client: Client): void {
    this.isRequesting = true;
    this.isBirthdayVisible = false;
    this.isEmailVisible = false;
    this.isFirstNameVisible = false;
    this.isLastNameVisible = false;
    this.isPassportNumberVisible = false;
    this.isPhoneVisible = false;

    this.apiClient.updateClient(client)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((result: Client) => {this.client = result; });
  }
}
