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
  selector: "app-workplace",
  templateUrl: "./workplace.component.html",
  styleUrls: ["./workplace.component.css"],
})
export class WorkplaceComponent implements OnInit {
  isSelectedTimesLoading = true;
  workplaceId: number;
  isRequesting = false;
  workplace: Workplace;
  workplaceEquipmentList: WorkplaceEquipment[];
  workplaceOrderList: WorkplaceOrder[];
  workplaceDate: Date;
  monStartWorkingTime;
  monFinishWorkingTime;
  tueStartWorkingTime;
  tueFinishWorkingTime;
  wedStartWorkingTime;
  wedFinishWorkingTime;
  thuStartWorkingTime;
  thuFinishWorkingTime;
  friStartWorkingTime;
  friFinishWorkingTime;
  satStartWorkingTime;
  satFinishWorkingTime;
  sunStartWorkingTime;
  sunFinishWorkingTime;
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

  @ViewChild("content") templateRef: TemplateRef<any>;

  constructor(private apiClient: APIClient, private modalService: NgbModal, private router: Router,
    private activateRoute: ActivatedRoute) { }

  doToMap() {
    this.router.navigate(["/map-search"]);
  }

  leftpad(val, resultLength = 2, leftpadChar = "0"): string {
    return (String(leftpadChar).repeat(resultLength) + String(val)).slice(
      String(val).length
    );
  }

  ngOnInit() {
    this.minDateString = moment(new Date()).format("YYYY-MM-DD");

    this.workplaceId = Number.parseFloat(this.activateRoute.snapshot.params['workplaceId']);
    if (this.workplaceId >= 0) {
      this.getData();
    }
  }

  getData() {
    this.isRequesting = true;

    const workplaceQuery = this.apiClient.getWorkplaceById(this.workplaceId);
    const workplaceEquipmentsQuery = this.apiClient.GetWorkplaceEquipmentByWorkplaceWithEquipment(
      this.workplaceId
    );

    forkJoin([workplaceQuery, workplaceEquipmentsQuery])
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe((results) => {
        this.workplace = results[0];
        this.workplaceEquipmentList = results[1];

        this.monStartWorkingTime = this.getTimeString(this.workplace.building.monStartTime);
        this.monFinishWorkingTime = this.getTimeString(this.workplace.building.monFinishTime);
        this.tueStartWorkingTime = this.getTimeString(this.workplace.building.tueStartTime);
        this.tueFinishWorkingTime = this.getTimeString(this.workplace.building.tueFinishTime);
        this.wedStartWorkingTime = this.getTimeString(this.workplace.building.wedStartTime);
        this.wedFinishWorkingTime = this.getTimeString(this.workplace.building.wedFinishTime);
        this.thuStartWorkingTime = this.getTimeString(this.workplace.building.thuStartTime);
        this.thuFinishWorkingTime = this.getTimeString(this.workplace.building.thuFinishTime);
        this.friStartWorkingTime = this.getTimeString(this.workplace.building.friStartTime);
        this.friFinishWorkingTime = this.getTimeString(this.workplace.building.friFinishTime);
        this.satStartWorkingTime = this.getTimeString(this.workplace.building.satStartTime);
        this.satFinishWorkingTime = this.getTimeString(this.workplace.building.satFinishTime);
        this.sunStartWorkingTime = this.getTimeString(this.workplace.building.sunStartTime);
        this.sunFinishWorkingTime = this.getTimeString(this.workplace.building.sunFinishTime);
      });
  }

  getTimeString(numericTime: number): string {
    if (numericTime % 1 === 0) {
      return numericTime + ":00";
    } else {
      return Math.floor(numericTime) + ":30";
    }
  }

  getWorkplaceOrdersByWorkplaceAndDate() {
    this.isRequesting = true;

    this.apiClient
      .getWorkplaceOrdersByWorkplaceAndDate(
        this.workplaceId,
        this.workplaceDate
      )
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe((data: WorkplaceOrder[]) => {
        this.workplaceOrders = data;
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

    let dayOfWeek = (new Date(this.workplaceDate)).getDay();

    let dayStart;
    let dayFinish;
    if (dayOfWeek === 0) {
      dayStart = this.workplace.building.sunStartTime;
      dayFinish =  this.workplace.building.sunFinishTime;
    } else if (dayOfWeek === 1) {
      dayStart = this.workplace.building.monStartTime;
      dayFinish =  this.workplace.building.monFinishTime;
    } else if (dayOfWeek === 2) {
      dayStart = this.workplace.building.tueStartTime;
      dayFinish =  this.workplace.building.tueFinishTime;
    } else if (dayOfWeek === 3) {
      dayStart = this.workplace.building.wedStartTime;
      dayFinish =  this.workplace.building.wedFinishTime;
    } else if (dayOfWeek === 4) {
      dayStart = this.workplace.building.thuStartTime;
      dayFinish =  this.workplace.building.thuFinishTime;
    } else if (dayOfWeek === 5) {
      dayStart = this.workplace.building.friStartTime;
      dayFinish =  this.workplace.building.friFinishTime;
    } else if (dayOfWeek === 6) {
      dayStart = this.workplace.building.satStartTime;
      dayFinish =  this.workplace.building.satFinishTime;
    }
    let startPoint = dayStart;

    if (dayStart % 1 !== 0) {
      startPoint = Math.floor(startPoint) + 0.5;
    }

    let endPoint = dayFinish;

    if (dayFinish % 1 !== 0) {
      endPoint = startPoint(endPoint) + 0.5;
    }
    if (this.minDateString === moment(this.workplaceDate).format("YYYY-MM-DD")) {

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
    console.log(this.sumToPay);
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

  createWorkplaceOrder() {
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

    let workplaceOrder: WorkplaceOrder = new WorkplaceOrder();
    workplaceOrder.startTime = startBookingTime;
    workplaceOrder.finishTime = finishBookingTime;
    workplaceOrder.workplaceId = this.workplaceId;
    workplaceOrder.sumToPay = this.sumToPay;

    this.apiClient
      .createWorkplaceOrder(workplaceOrder)
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
