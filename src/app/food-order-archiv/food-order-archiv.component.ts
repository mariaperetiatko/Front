import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Client, FoodOrder } from '../api.service';

@Component({
  selector: 'app-food-order-archiv',
  templateUrl: './food-order-archiv.component.html',
  styleUrls: ['./food-order-archiv.component.css']
})
export class FoodOrderArchivComponent implements OnInit {

  foodOrders: FoodOrder[];

  constructor(private client: Client, private router: Router,  private userService: UserService) { }

  ngOnInit() {
    this.getFoodOrders();
  }

  getFoodOrders(): void {
    this.client.getListOfFoodOrders()
    .subscribe((data: FoodOrder[]) => {
      this.foodOrders = data;
    });
  }

  boxMap(): void {
    this.router.navigate(['/boxMap']);
  }
}
