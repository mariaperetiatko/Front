import { Component, AfterContentInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { Client, Restaurant, Menu, Dish} from '../api.service';
import { UserService } from '../user.service';

import { finalize } from 'rxjs/operators';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-restaurant-page',
  templateUrl: './restaurant-page.component.html',
  styleUrls: ['./restaurant-page.component.css']
})
export class RestaurantPageComponent implements AfterContentInit, OnDestroy {

  restaurant: Restaurant;
  menues: Menu[];
  dish: Dish;
  dishes: Dish[];

  constructor(private client: Client, private router: Router,  private userService: UserService) { }

  ngAfterContentInit() {
   this. getRestaurant();
   this.getMenuesByRestaurant();
   this.getListOfDishes();
  }

  getRestaurant(): void {
    const restaurant: Restaurant = JSON.parse(localStorage.getItem('restaurant'));
    this.restaurant = restaurant;
   alert(restaurant.id);
  }

  getMenuesByRestaurant(): void {
    this.client.getMenuesByRestaurant(this.restaurant.id)
    .subscribe((data: Menu[]) => this.menues = data);

  }

  ngOnDestroy() {
    localStorage.removeItem('restaurant');
  }

  getDishById(dishId: number): void {
    this.client.getDishById(this.restaurant.id)
    .subscribe((data: Dish) => this.dish = data);
  }

  getListOfDishes(): void {
    for (let i = 0; i < this.menues.length; i++) {
        this.client.getDishById(this.menues[i].id)
        .subscribe((data: Dish) => this.dishes[i] = data);
    }
  }

}
