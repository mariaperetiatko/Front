import { FilteredPagedResult } from '../api.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { APIClient, WorkplaceOrder, Filter } from '../api.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-bookings-archive',
  templateUrl: './bookings-archive.component.html',
  styleUrls: ['./bookings-archive.component.css']
})
export class BookingsArchiveComponent implements OnInit {

  isRequesting = false;
  workplaceOrders: WorkplaceOrder[] = [];
  totalSum;
  pageCount;
  page = 1;
  filter: Filter;
  pageCountNumber = 0;

  @ViewChild('content') templateRef: TemplateRef<any>;

  constructor(private apiClient: APIClient, private router: Router, private userService: UserService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.filter = new Filter();
    this.loadPreviouse(this.page);
  }

  loadPreviouse(pageNumber) {
    this.filter.startTime = null;
    this.filter.finishTime = new Date();
    this.page = pageNumber;

    this.getFilteredOrders();
  }

  getFilteredOrders() {
    this.isRequesting = true;
    this.apiClient.getFilteredWorkplaceOrdersListByClient(this.filter, this.page)
      .pipe(finalize(() => this.isRequesting = false))
      .subscribe((data: FilteredPagedResult) => {
        this.workplaceOrders = data.workplaceOrders;
        this.pageCountNumber = data.totalCount;
        console.log(data.totalCount);

        this.pageCount = Array(data.totalCount).fill(0).map((x, i) => i + 1)
        this.totalSum = 0;
        for (let i = 0; i < this.workplaceOrders.length; i++) {
          this.totalSum += this.workplaceOrders[i].sumToPay;
        }
      });
  }
}
