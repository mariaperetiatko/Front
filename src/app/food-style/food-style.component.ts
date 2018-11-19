import { Component, OnInit } from '@angular/core';
import { Client, FoodStyle, Customer, Product } from '../api.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-food-style',
  templateUrl: './food-style.component.html',
  styleUrls: ['./food-style.component.css']
})
export class FoodStyleComponent implements OnInit {

  foodStyle: FoodStyle;
  isRequesting: boolean;
  customer: Customer;
  isCustomerRequesting: boolean;
  isFoodStyleExists: boolean;
  foodStyles: FoodStyle[];
  products: Product[];
  foodStyleName: string;

  constructor(private client: Client, private router: Router,  private userService: UserService) { }

  ngOnInit() {
    this.getCustomer();
    this.getFoodStyleByCustomer();
    this.getListOfFoodStyles();
  }

  getFoodStyleByCustomer(): void {
    this.isRequesting = true;
    this.client.getFoodStyleByCustomer()
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: FoodStyle) => this.foodStyle = data);
  }

  getCustomer(): void {
    this.isCustomerRequesting = true;

    this.client.getCustomer()
    .pipe(finalize(() => this.isCustomerRequesting = false))
    .subscribe((data: Customer) => this.customer = data);

  }

  deleteCustomersFoodStyle(customerId: number): void {
    this.isRequesting = true;
    this.client.deleteCustomersFoodStyle(customerId)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe(
      result => {
        if (result) {
          window.location.reload();
        }
      }
    );
  }

  getListOfFoodStyles(): void {
    this.isCustomerRequesting = true;

    this.client.getListOfFoodStyles()
    .pipe(finalize(() => this.isCustomerRequesting = false))
    .subscribe((data: FoodStyle[]) => this.foodStyles = data);
  }

  changeFoodStyle(customerId: number, foodStyleId: number): void {
    this.isRequesting = true;
    this.client.changeFoodStyle(customerId, foodStyleId)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe(
      result => {
        if (result) {
          window.location.reload();
        }
      }
    );
  }

  productByFoodStyle(foodStyleId: number, foodStyleName: string): void {
    this.isRequesting = true;
    alert(foodStyleName);
    this.client.productByFoodStyle(foodStyleId)
    .pipe(finalize(() => {
      this.isRequesting = false;
      this.foodStyleName = foodStyleName;
    }
    ))
    .subscribe((data: Product[]) => this.products = data);

  }


}
