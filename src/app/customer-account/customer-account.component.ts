import { Component, OnInit } from '@angular/core';
import { Client, Customer, FoodStyle } from '../api.service';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-customer-account',
  templateUrl: './customer-account.component.html',
  styleUrls: ['./customer-account.component.css']
})
export class CustomerAccountComponent implements OnInit {

  customer: Customer;
  isRequesting: boolean;
  moneySum: number;
  caloricValue: number;
  firstName: string;
  lastName: string;
  phoneNumber: number;
  foodStyle: FoodStyle;
  isFoodNameRequesting: boolean;

  constructor(private client: Client, private router: Router,  private userService: UserService) { }

  ngOnInit() {

    this.getCustomer();
    this.getFoodStyleByCustomer();
  }

  getCustomer(): void {
    this.isRequesting = true;

    this.client.getCustomer()
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: Customer) => this.customer = data);

  }

  getFoodStyleByCustomer(): void {
    this.isFoodNameRequesting = true;

    this.client.getFoodStyleByCustomer()
    .pipe(finalize(() => this.isFoodNameRequesting = false))
    .subscribe((data: FoodStyle) => this.foodStyle = data);

  }

  getSpecialProducts(): void {

    this.router.navigate(['/specialProducts']);
  }

  getFoodStyle(): void {
    this.router.navigate(['/foodStyle']);
  }

  favouriteDishes(): void {
    this.router.navigate(['/favouriteDishes']);
  }

  cart(): void {
    this.router.navigate(['/cart']);
  }

  changeBalance(custId: number, money: number): void {
    this.isRequesting = true;

    this.client.increaseBalance(custId, money)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe(
      result => {
        if (result) {
          window.location.reload();
        }
      }
    );
  }

  changeCaloricGoal(custId: number, caloric: number): void {
    this.isRequesting = true;

    this.client.changeCaloricGoal(custId, caloric)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe(
      result => {
        if (result) {
          window.location.reload();
        }
      }
    );
  }

  changeFirstName(custId: number, firstName: string): void {
    this.isRequesting = true;

    this.client.changeFirstName(custId, firstName)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe(
      result => {
        if (result) {
          window.location.reload();
        }
      }
    );
  }

  changeLastName(custId: number, lastName: string): void {
    this.isRequesting = true;

    this.client.changeLastName(custId, lastName)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe(
      result => {
        if (result) {
          window.location.reload();
        }
      }
    );
  }

  changePhoneNumber(custId: number, phone: number): void {
    this.isRequesting = true;

    this.client.changePhoneNumber(custId, phone)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe(
      result => {
        if (result) {
          window.location.reload();
        }
      }
    );
  }

  getFoodStyleById(foodStyleId: number): void {
    this.isRequesting = true;
    alert(foodStyleId);
    this.client.getFoodStyleById(foodStyleId)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: FoodStyle) => this.foodStyle = data);

    alert(this.foodStyle.foodStyleName);

  }

}
