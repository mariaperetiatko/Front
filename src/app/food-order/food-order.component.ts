import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Client, FoodOrder, Cart } from '../api.service';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-food-order',
  templateUrl: './food-order.component.html',
  styleUrls: ['./food-order.component.css']
})
export class FoodOrderComponent implements OnInit {

  foodOrder = new FoodOrder({

  });
  cart: Cart;
  isRequesting: boolean;
  payResult = '';
  paySuccess = false;
  payNotSuccess = false;

  constructor(private client: Client, private router: Router,  private userService: UserService) { }

  ngOnInit() {
    this.createFoodOrder();
  }

  createFoodOrder(): void {
    this.isRequesting = true;
    this.client.createFoodOrder(this.foodOrder)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: FoodOrder) => {
      this.foodOrder = data;
    });
  }

  deleteFoodOrder(): void {
    this.client.deleteFoodOrder(this.foodOrder.id)
    .subscribe(result => {
      if (result) {
        this.router.navigate(['/cart']);
      }
    });
  }

  pay(): void {
    this.client.pay(this.foodOrder.id)
    .subscribe((data: string) => {
      this.payResult = data;
      if (this.payResult === 'Succesful pay!') {
        this.paySuccess = true;
        this.payNotSuccess = false;
      } else {
        this.paySuccess = false;
        this.payNotSuccess = true;
      }
    });
  }

}
