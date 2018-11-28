import { finalize } from 'rxjs/operators';
import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Client, Customer, Cart, CartPart, Menu, Restaurant, Dish, DeliveryAddress } from '../api.service';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Subscriber } from 'rxjs';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: Cart;
  cartParts: CartPart[] = [];
  menues: Menu[] = [];
  restaurants: Restaurant[] = [];
  dishes: Dish[] = [];
  minDate = Date.now();
  isRequesting = false;
  deliveryAddresses: DeliveryAddress[];
  currentAddress: DeliveryAddress;
  currentMealTime: string;

  constructor(private client: Client, private router: Router,  private userService: UserService) { }

  ngOnInit() {
    alert(this.minDate);
    this.getOwnCart();
    this.getListOfDeliveryAddresses();
  }

  getOwnCart(): void {
    this.isRequesting = true;
    this.client.getOwnCart()
    .subscribe((data: Cart) => {
      this.cart = data;
      this.getCartPartByCustomer();
      this.getDeliveryAddressById();
      this.getMealTimeName();
    });
  }

  getCartPartByCustomer(): void {
    this.client.getCartPartByCustomer(this.cart.customerId)
    .subscribe((data: CartPart[]) => {
      this.cartParts = data;
      this.getAllMenues();
    });
  }

  getAllMenues(): void {
    for (let i = 0; i < this.cartParts.length; i++) {
      this.client.getMenuById(this.cartParts[i].menuId)
      .pipe(finalize(() => this.isRequesting = false))
      .subscribe((data: Menu) => {
        this.menues[i] = data;
        this.getRestaurantById(this.menues[i].restaurantId);
        this.getDishById(this.menues[i].dishId);
      });
    }
  }

  getRestaurantById(restaurantId: number): void {
    this.client.getRestaurantById(restaurantId)
    .subscribe((data: Restaurant) => this.restaurants.push(data));
  }

  getDishById(dishId: number): void {
    this.client.getDishById(dishId)
    .subscribe((data: Dish) => this.dishes.push(data));
  }

  getListOfDeliveryAddresses(): void {
    this.client.getListOfDeliveryAddresses()
    .subscribe((data: DeliveryAddress[]) => this.deliveryAddresses = data);
  }

  getDeliveryAddressById(): void {
    this.client.getDeliveryAddressById(this.cart.addressId)
    .subscribe((data: DeliveryAddress) => this.currentAddress = data);
  }

  changeCart(): void {
    alert(this.cart.deliveryDate);
    this.client.updateCart(this.cart)
    .subscribe(result => {
      if (result) {
        window.location.reload();
      }
    });
  }

  getMealTimeName(): void {
    switch (this.cart.mealTimeId) {
      case 0:
        this.currentMealTime = 'BREAKFAST';
        break;
      case 2:
        this.currentMealTime = 'supper';
        break;
      default:
        this.currentMealTime = 'dinner';
        break;
    }
  }

  updateCartPart(currentCartPart: CartPart): void {
    this.client.updateCartPart(currentCartPart)
    .subscribe(result => {
      if (result) {
        window.location.reload();
      }
    });
  }

  deleteCartPart(menuId: number, cartId: number): void {
    this.client.deleteCartPart(menuId, cartId, '')
    .subscribe(result => {
      if (result) {
        window.location.reload();
      }
    });
  }

  foodOrder(): void {
    this.router.navigate(['/foodOrder']);
  }
}
