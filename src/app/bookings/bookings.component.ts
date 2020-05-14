import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { APIClient, WorkplaceOrder, Filter } from '../api.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  isRequesting = false;
  workplaceOrders = [];
  totalSum;
  constructor(private apiClient: APIClient, private router: Router,  private userService: UserService) { }

  ngOnInit() {
    let filter: Filter = new Filter();
    filter.startTime = new Date();
    filter.finishTime = null;
    this.getFutureWorkplaceOrders(filter);
  }

  getFutureWorkplaceOrders(filter) {
    this.isRequesting = true;
    this.apiClient.getFilteredWorkplaceOrdersListByClient(filter)
      .pipe(finalize(() => this.isRequesting = false))
      .subscribe((data: WorkplaceOrder[]) => {
      this.workplaceOrders = data;
      this.totalSum = 0;
      for (let i = 0; i < this.workplaceOrders.length; i++) {
        this.totalSum += this.workplaceOrders[i].sumToPay;
      }
      console.log(data);
    });
  }

}
