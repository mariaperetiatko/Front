import { Component, OnInit } from '@angular/core';
import { Client, Dish, FavouriteDish, Customer } from '../api.service';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-favourite-dishes',
  templateUrl: './favourite-dishes.component.html',
  styleUrls: ['./favourite-dishes.component.css']
})
export class FavouriteDishesComponent implements OnInit {

  favouriteDishes: Dish[];
  notFavouriteDishes: Dish[];
  isRequesting: boolean;
  customer: Customer;


  constructor(private client: Client, private router: Router,  private userService: UserService) { }

  ngOnInit() {
    this.getCustomer();
    this.getFavouriteDishesByCustomer();
    this.getNotFavouriteDishesByCustomer();
  }

  getCustomer(): void {
    this.isRequesting = true;

    this.client.getCustomer()
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: Customer) => this.customer = data);

  }

  getFavouriteDishesByCustomer(): void {
    this.isRequesting = true;

    this.client.getFavouriteDishesByCustomer()
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: Dish[]) => this.favouriteDishes = data);
  }

  getNotFavouriteDishesByCustomer(): void {
    this.isRequesting = true;

    this.client.getNotFavouriteDishesByCustomer()
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: Dish[]) => this.notFavouriteDishes = data);
  }

  deleteFavouriteDish(customerId: number, dishId: number): void {
    this.isRequesting = true;
    this.client.deleteFavouriteDish(customerId, dishId, '')
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe(
      result => {
        if (result) {
          window.location.reload();
        }
      }
    );
  }

    createFavouriteDish(customerId: number, dishId: number): void {
      this.isRequesting = true;
      const favDish: FavouriteDish = new FavouriteDish();
      favDish.customerId = customerId;
      favDish.dishId = dishId;
      this.client.createFavouriteDish(favDish)
      .pipe(finalize(() => this.isRequesting = false))
      .subscribe(
        result => {
          if (result) {
            window.location.reload();
          }
        }
      );
  }
}
