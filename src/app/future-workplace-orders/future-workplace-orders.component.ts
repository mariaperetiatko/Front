import { Component, OnInit } from '@angular/core';
import { APIClient, WorkplaceOrder } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-future-workplace-orders',
  templateUrl: './future-workplace-orders.component.html',
  styleUrls: ['./future-workplace-orders.component.css']
})
export class FutureWorkplaceOrdersComponent implements OnInit {

  workplaceId;
  buildingName;
  isRequesting = false;
  workplaceOrders: WorkplaceOrder[];
  buildingId;

  constructor(
    private apiClient: APIClient,
    private router: Router,
    private userService: UserService, private activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.workplaceId = Number.parseFloat(this.activateRoute.snapshot.params['workplaceId']);
    this.buildingName = Number.parseFloat(this.activateRoute.snapshot.params['buildingName']);
    this.buildingId = Number.parseFloat(this.activateRoute.snapshot.params['buildingId']);


    if (this.workplaceId >= 0) {
      this.getOrdersArchive();
    }
  }

  goToBuildings() {
    this.router.navigate(["/landlord-buildings/"]);
  }

  goToWorkplaces() {
    this.router.navigate(["/building/workplaces/", this.buildingId]);

  }

  getOrdersArchive() {
    this.isRequesting = true;

    this.apiClient
      .getFutureWorkplaceOrdersByWorkplace(this.workplaceId)
      .pipe(finalize(() => this.isRequesting = false))
      .subscribe((data: WorkplaceOrder[]) => {
        this.workplaceOrders = data;
      });
  }

  deleteWorkplaceOrder(orderId) {
    this.isRequesting = true;

    this.apiClient
      .deleteWorkplaceOrder(orderId)
      .subscribe((data) => {
        this.getOrdersArchive();
      });
  }

}
