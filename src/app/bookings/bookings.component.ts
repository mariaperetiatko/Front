import { FilteredPagedResult } from '../api.service';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { APIClient, WorkplaceOrder, Filter } from '../api.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  isRequesting = false;
  isDeliting = false;
  workplaceOrders: WorkplaceOrder[] = [];
  totalSum;
  pageCount;
  page = 1;
  orderToDeliteId;
  filter: Filter;
  pageCountNumber = 0;
  isFuture = true;
  isPreviouse = false;
  todayDateString;
  startDate: Date;
  finishDate: Date;
  minFinishDate;
  maxStartDate;
  isFiltered = false;

  @ViewChild('content') templateRef: TemplateRef<any>;

  constructor(private apiClient: APIClient, private router: Router, private userService: UserService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.todayDateString = moment(new Date()).format("YYYY-MM-DD");
    this.minFinishDate = moment(new Date()).format("YYYY-MM-DD");

    this.filter = new Filter();
    this.loadFuture(this.page);
  }

  openDeliteConfirmationWindow(orderId) {
    this.orderToDeliteId = orderId;
    const element: HTMLElement = document.getElementById('myDiv') as HTMLElement;
    element.click();
  }

  open() {
    this.modalService.open(this.templateRef, { ariaLabelledBy: 'modal-basic-title' });
  }

  setMinFinishDate() {
    this.minFinishDate = moment(this.startDate).format("YYYY-MM-DD");
  }

  setMaxStartDate() {
    this.maxStartDate = moment(this.finishDate).format("YYYY-MM-DD");
  }

  loadFuture(pageNumber) {
    this.isFuture = true;
    this.isPreviouse = false;

    this.page = pageNumber;
    this.filter.startTime = new Date();
    this.filter.finishTime = null;
    this.isFiltered = false;
    this.getFilteredOrders();
  }

  loadFiltered(pageNumber) {
    this.page = pageNumber;
    this.filter.startTime = this.startDate;
    this.filter.finishTime = this.finishDate;
    this.isFiltered = true;
    this.getFilteredOrders();
  }

  deleteWorkplaceOrder(orderId) {
    this.isDeliting = true;
    this.apiClient.deleteWorkplaceOrder(this.orderToDeliteId)
      .pipe(finalize(() => this.isDeliting = false))
      .subscribe((data) => {
        if (this.workplaceOrders.length == 1 && this.page > 1) {
          this.page = this.page - 1;
        }
        this.loadFuture(this.page);
      });
  }

  removeFinishDate() {
    this.finishDate = null;
  }

  loadPreviouse(pageNumber) {
    this.isFuture = false;
    this.isPreviouse = true;

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
