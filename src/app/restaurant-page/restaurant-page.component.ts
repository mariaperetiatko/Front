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
  dishes: Dish[] = [];
  isRequesting = true;
  singleArray = [];
  constructor(private client: Client, private router: Router,  private userService: UserService) { }

  ngAfterContentInit() {
   this. getRestaurant();
   this.getMenuesByRestaurant();
  // this.getListOfDishes();
  }

  getRestaurant(): void {
    const restaurant: Restaurant = JSON.parse(localStorage.getItem('restaurant'));
    this.restaurant = restaurant;
  //  alert(restaurant.id);
  }

  getMenuesByRestaurant(): void {

    this.client.getMenuesByRestaurant(this.restaurant.id)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: Menu[]) => {
      this.menues = data;
      this.getListOfDishes();

      }
    );
  }

  mergeArrays(): void {
    for (let i = 0; i < this.menues.length; i++) {
      this.singleArray[i] = {
                           menuId: this.menues[i].id,
                           menuCost: this.menues[i].cost,
                           dishId: this.dishes[i].id,
                           dishName: this.dishes[i].dishName
                          };
                          alert(this.menues[i].id);
      }
  }

  ngOnDestroy() {
    localStorage.removeItem('restaurant');
  }

  getDishById(dishId: number): string {

    this.client.getDishById(dishId)
    .subscribe((data: Dish) => this.dish = data);

  return this.dish.dishName;
}

  getListOfDishes(): void {
    for (let i = 0; i < this.menues.length; i++) {
        this.client.getDishById(this.menues[i].dishId)
        .subscribe((data: Dish) => {
          this.dishes[i] = data;
        }
        );
    }

  }

}
