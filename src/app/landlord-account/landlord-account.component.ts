import { Component, OnInit } from '@angular/core';
import { APIClient, Client, Landlord } from '../api.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-landlord-account',
  templateUrl: './landlord-account.component.html',
  styleUrls: ['./landlord-account.component.css']
})
export class LandlordAccountComponent implements OnInit {

  landlord: Landlord;
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
    this.getLandlord();
  }

  isValidModel() {
    const emailPattern = new RegExp('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$');
    const phonePattern = new RegExp('^[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2}$');

    return this.landlord.firstName !== '' &&
           this.landlord.lastName !== '' &&
           emailPattern.test(this.landlord.email) &&
           phonePattern.test(this.landlord.phone);
  }

  getLandlord(): void {
    this.isRequesting = true;

    this.apiClient.getLandlordById(1)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: Landlord) => this.landlord = data);
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

  updateLandlord(landlord: Landlord): void {
    this.isRequesting = true;
    this.isBirthdayVisible = false;
    this.isEmailVisible = false;
    this.isFirstNameVisible = false;
    this.isLastNameVisible = false;
    this.isPassportNumberVisible = false;
    this.isPhoneVisible = false;

    this.apiClient.updateLandlord(landlord)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((result: Landlord) => { this.landlord = result; });
  }
}
