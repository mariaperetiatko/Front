import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import {
  Workplace,
  APIClient,
  WorkplaceOrder,
  WorkplaceEquipment,
} from "./../api.service";
import { List } from "linqts";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin } from "rxjs";
import { finalize } from "rxjs/operators";
import * as moment from "moment";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-booking-edit',
  templateUrl: './booking-edit.component.html',
  styleUrls: ['./booking-edit.component.css']
})
export class BookingEditComponent implements OnInit {
  isSelectedTimesLoading = true;
  isRequesting = false;
  workplace: Workplace;
  workplaceEquipmentList: WorkplaceEquipment[];
  workplaceOrderList: WorkplaceOrder[];
  workplaceDate: Date;
  startWorkingTime;
  finishWorkingTime;
  timesToBook = [];
  durationTimesToBook = [];
  isTimesLoading = true;
  startTime;
  finishTime;
  isDateSelecting = true;
  workplaceOrders;
  busyTimes = [];
  sumToPay;
  minDateString;
  finishTimeNumeric;
  isBookingRequesting = false;
  isBookingCreated = false;
  workplaceOrderId;
  workplaceOrder: WorkplaceOrder;

  @ViewChild("content") templateRef: TemplateRef<any>;

  constructor(private apiClient: APIClient, private modalService: NgbModal, private router: Router,
    private activateRoute: ActivatedRoute) { }

    goToFutureBookings() {
      this.router.navigate(["/bookings/future-bookings"]);
  }

  leftpad(val, resultLength = 2, leftpadChar = "0"): string {
    return (String(leftpadChar).repeat(resultLength) + String(val)).slice(
      String(val).length
    );
  }

  ngOnInit() {
    this.minDateString = moment(new Date()).format("YYYY-MM-DD");

    this.workplaceOrderId = Number.parseFloat(this.activateRoute.snapshot.params['workplaceOrderId']);
    if (this.workplaceOrderId >= 0) {
      this.getData();
    }
  }

  getData() {
    this.isRequesting = true;
    console.log('1');
    this.apiClient.getWorkplaceOrderById(this.workplaceOrderId)
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe((data: WorkplaceOrder) => {
        console.log('data');

        console.log(data);
        this.workplace = data.workplace;
        this.workplaceEquipmentList = data.workplace.workplaceEquipment;
        this.workplaceOrder = data;
        if (this.workplace.building.startMinute === 0) {
          this.startWorkingTime = this.workplace.building.startHour + ":00";
        } else {
          this.startWorkingTime = this.workplace.building.startHour + ":30";
        }
        if (this.workplace.building.finishMinute === 0) {
          this.finishWorkingTime = this.workplace.building.finistHour + ":00";
        } else {
          this.finishWorkingTime = this.workplace.building.finistHour + ":30";
        }
      });
  }

  findWithAttr(array, attr, value) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i][attr] == value) {
        return i;
      }
    }
    return -1;
  }

  getWorkplaceOrdersByWorkplaceAndDate() {
    this.isRequesting = true;

    this.apiClient
      .getWorkplaceOrdersByWorkplaceAndDate(
        this.workplace.id,
        this.workplaceDate
      )
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe((data: WorkplaceOrder[]) => {
        this.workplaceOrders = data;

        const index: number = this.findWithAttr(
          this.workplaceOrders,
          "id",
          this.workplaceOrderId
        );

        if (index !== -1) {
          this.workplaceOrders.splice(index, 1);
        }

        this.busyTimes = [];
        for (let i = 0; i < this.workplaceOrders.length; i++) {
          const startHour = this.workplaceOrders[i].startTime.getHours();
          const startMinute = this.workplaceOrders[i].startTime.getMinutes();
          let start: number;

          if (startMinute === 0) {
            start = startHour;
          } else {
            start = startHour + 0.5;
          }

          const finishHour = this.workplaceOrders[i].finishTime.getHours();
          const finishMinute = this.workplaceOrders[i].finishTime.getMinutes();
          let finish: number;

          if (finishMinute === 0) {
            finish = finishHour;
          } else {
            finish = finishHour + 0.5;
          }
          this.busyTimes.push({ start: start, finish: finish });
        }

        this.getAvailableTimesDyDate();
      });
  }

  getAvailableTimesDyDate() {

    this.isDateSelecting = false;
    this.isSelectedTimesLoading = true;
    this.isTimesLoading = true;
    this.timesToBook = [];
    let startPoint = this.workplace.building.startHour;

    if (this.workplace.building.startMinute !== 0) {
      startPoint += 0.5;
    }

    let endPoint = this.workplace.building.finistHour;

    if (this.workplace.building.finishMinute !== 0) {
      endPoint += 0.5;
    }
    if (
      this.minDateString === moment(this.workplaceDate).format("YYYY-MM-DD")
    ) {

      let dt = new Date();
      let currentNumeric = dt.getHours();
      if (dt.getMinutes() > 0 && dt.getMinutes() <= 30) {
        currentNumeric += 0.5;
      } else if (dt.getMinutes() > 30) {
        currentNumeric += 1;
      }
      startPoint = currentNumeric;
      for (let i = 0; i < this.busyTimes.length - 1; i++) {
        if (this.busyTimes[i].start < currentNumeric) {
          startPoint =
            this.busyTimes[i].finish > currentNumeric
              ? this.busyTimes[i].finish
              : currentNumeric;

          this.busyTimes.shift();
        }
      }
    }

    this.busyTimes.unshift({ finish: startPoint });
    this.busyTimes.push({ start: endPoint });

    for (let j = 0; j < this.busyTimes.length - 1; j++) {
      for (
        let i = this.busyTimes[j].finish;
        i < this.busyTimes[j + 1].start;
        i += 0.5
      ) {
        let time;
        let rest;

        const timeNumeric = i;
        const restNumeric = this.busyTimes[j + 1].start - i;
        if (i % 1 === 0) {
          time = i + ":00";
        } else {
          time = i - 0.5 + ":30";
        }
        if ((this.busyTimes[j + 1].start - i) % 1 === 0) {
          rest = this.busyTimes[j + 1].start - i + ":00";
        } else {
          rest = this.busyTimes[j + 1].start - i - 0.5 + ":30";
        }
        this.timesToBook.push({
          time: time,
          rest: rest,
          timeNumeric: timeNumeric,
          restNumeric: restNumeric,
        });
      }
    }
    this.isTimesLoading = false;
  }


  bookWorkplace(duration) {
    this.finishTimeNumeric = this.startTime.timeNumeric + duration.restNumeric;

    if (this.finishTimeNumeric % 1 === 0) {
      this.finishTime = this.finishTimeNumeric + ":00";
    } else {
      this.finishTime = this.finishTimeNumeric - 0.5 + ":30";
    }
    this.sumToPay = duration.restNumeric * this.workplace.cost;
  }

  selectStartTime(item) {
    this.isDateSelecting = false;
    this.startTime = item;
    this.isTimesLoading = true;
    this.isSelectedTimesLoading = true;
    this.durationTimesToBook = [];
    for (let i = 0.5; i <= item.restNumeric; i += 0.5) {
      let rest;
      if (i % 1 === 0) {
        rest = i + ":00";
      } else {
        rest = i - 0.5 + ":30";
      }

      this.durationTimesToBook.push({ rest: rest, restNumeric: i });
    }

    this.isSelectedTimesLoading = false;
  }

  editWorkplaceOrder() {
    this.isBookingRequesting = true;
    let startBookingTime: Date = new Date(this.workplaceDate);

    if (this.startTime.timeNumeric % 1 === 0) {
      startBookingTime.setHours(this.startTime.timeNumeric);
      startBookingTime.setMinutes(0);
    } else {
      startBookingTime.setHours(this.startTime.timeNumeric - 0.5);
      startBookingTime.setMinutes(30);
    }
    console.log(startBookingTime);
    let finishBookingTime: Date = new Date(this.workplaceDate);

    if (this.finishTimeNumeric % 1 === 0) {
      finishBookingTime.setHours(this.finishTimeNumeric);
      finishBookingTime.setMinutes(0);
    } else {
      finishBookingTime.setHours(this.finishTimeNumeric - 0.5);
      finishBookingTime.setMinutes(30);
    }

    this.workplaceOrder.startTime = startBookingTime;
    this.workplaceOrder.finishTime = finishBookingTime;
    this.workplaceOrder.sumToPay = this.sumToPay;

    this.apiClient
      .updateWorkplaceOrder(this.workplaceOrder)
      .pipe(finalize(() => (this.isBookingRequesting = false)))
      .subscribe((data: WorkplaceOrder) => {
        const element: HTMLElement = document.getElementById(
          "myDiv"
        ) as HTMLElement;
        element.click();

        console.log(data);
      });
  }

  okClick() {
    this.workplaceDate = null;
    this.sumToPay = null;
    this.startTime = null;
    this.finishTime = null;
    this.isDateSelecting = true;
    this.isTimesLoading = true;
    this.isSelectedTimesLoading = true;
  }

  open() {
    console.log(this.templateRef);
    this.modalService.open(this.templateRef, {
      ariaLabelledBy: "modal-basic-title",
    });
  }
}

