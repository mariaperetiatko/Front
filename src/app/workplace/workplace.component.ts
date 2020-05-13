import { Component, OnInit, OnDestroy } from "@angular/core";
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

@Component({
  selector: "app-workplace",
  templateUrl: "./workplace.component.html",
  styleUrls: ["./workplace.component.css"],
})
export class WorkplaceComponent implements OnInit, OnDestroy {
  isSelectedTimesLoading = true;
  workplaceId: number;
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
  todayDate = new Date();
  minDateString = this.todayDate.getFullYear() + '-' + (this.todayDate.getMonth() + 1) + '-' + this.todayDate.getDate();

  constructor(private apiClient: APIClient) {}

  ngOnInit() {
    console.log(this.minDateString);
    this.workplaceId = Number.parseFloat(localStorage.getItem("workplaceId"));
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
    const workplaceOrdersQuery = this.apiClient.GetWorkplaceOrdersByWorkplaceId(
      this.workplaceId
    );

    forkJoin([workplaceQuery, workplaceEquipmentsQuery, workplaceOrdersQuery])
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe((results) => {
        this.workplace = results[0];
        this.workplaceEquipmentList = results[1];
        this.workplaceOrderList = results[2];
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
    let startPoint = this.workplace.building.startHour;

    if (this.workplace.building.startMinute !== 0) {
      startPoint += 0.5;
    }

    let endPoint = this.workplace.building.finistHour;

    if (this.workplace.building.finishMinute !== 0) {
      endPoint += 0.5;
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

  ngOnDestroy() {
    localStorage.removeItem("workplaceId");
  }

  bookWorkplace(duration) {
    const finishTimeNumeric = this.startTime.timeNumeric + duration.restNumeric;

    if (finishTimeNumeric % 1 === 0) {
      this.finishTime = finishTimeNumeric + ":00";
    } else {
      this.finishTime = finishTimeNumeric - 0.5 + ":30";
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
  /* client: Client;
  landlord: Landlord;
  isOrdersVisible = false;
  workplace: Workplace;
  selectedYear = (new Date()).getFullYear();
  selectedMonth = (new Date()).getMonth() + 1;
  selectedDay = (new Date()).getDate();
  minDay = (new Date()).getDate();
  minMonth = (new Date()).getMonth() + 1;
  dateItems = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  workplaceOrdersList: List<WorkplaceOrder> = new List<WorkplaceOrder>();
  appropriateWorkplaceOrders: List<WorkplaceOrder> =  new List<WorkplaceOrder>();
  selectedWorkplaceOrdersByDay: WorkplaceOrder[] = [];
  workplaceEquipmentsList: List<WorkplaceEquipment> = new List<WorkplaceEquipment>();
  appropriateWorkplaceEquipment: WorkplaceEquipment[] = [];
  equipment: string[] = [];
  counts = {};
  isEqShow = false;

  selectedHours = (new Date()).getHours();
  selectedMinutes =  (new Date()).getMinutes();
  minHours = (new Date()).getHours();
  minMinutes = (new Date()).getMinutes();
  minFinishMinutes = (new Date()).getMinutes();
  selectedFinishHours =  (new Date()).getHours();
  selectedFinishMinutes = (new Date()).getMinutes();
isRequesting = true;
  creatingResult = '';

  constructor(private apiClient: APIClient, public trans: TranslateService) {
    //trans.use(localStorage.getItem('lang'));

  }

  ngOnInit() {
    this.getClient();
    this.getWorkplace();
    this.getEquipment();
    console.log(this.minHours);
  }

  getWorkplace() {
    this.workplace = JSON.parse(localStorage.getItem('selectedWorkplace'));

    this.apiClient.getWorkplaceOrdersList()
    .subscribe((data: WorkplaceOrder[]) => {
      this.workplaceOrdersList = new List<WorkplaceOrder>(data);
      this.appropriateWorkplaceOrders = this.workplaceOrdersList
      .Where(x => x.workplaceId === this.workplace.id);
    });

    this.apiClient.getBuildingById(this.workplace.buildingId)
    .subscribe((data: Building) => {
      this.apiClient.getLandlordById(data.landlordId)
        .subscribe((landlord: Landlord) => {
          this.landlord = landlord;
          this.isRequesting = false;
        });
      });
  }

  getEquipment() {
    this.apiClient.getWorkplaceEquipmentsList()
    .subscribe((data: WorkplaceEquipment[]) => {
      this.workplaceEquipmentsList = new List<WorkplaceEquipment>(data);
      this.appropriateWorkplaceEquipment = this.workplaceEquipmentsList
      .Where(x => x.workplaceId === this.workplace.id).ToArray();
      for (const item of this.appropriateWorkplaceEquipment) {
        this.apiClient.getEquipmentById(item.equipmentId)
        .subscribe((eqData: Equipment) => {
          this.equipment.push(eqData.name);
        });
      }
    });
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
}

  showEquipment() {
    if (!this.isEqShow) {
      var ccc = {};
      console.log(this.equipment);
      this.equipment.forEach(function(x) { ccc[x] = (ccc[x] || 0) + 1; });
      this.counts = ccc;
      console.log(this.counts);
    this.isEqShow = true;
    } else {
      this.isEqShow = false;
    }
  }

  showObject() {
    var result = "";
    for (var p in this.counts) {
      if(this.counts.hasOwnProperty(p) ) {
        result += p + " - " + this.counts[p] + "\n";
      }
    }
    return result;
  }

  getDayOrders() {
    if (!this.isOrdersVisible) {
      this.getWorkplace();
      this.delay(1000).then( any => {
      this.selectedWorkplaceOrdersByDay = this.appropriateWorkplaceOrders
      .Where(x =>  x.startTime.getFullYear() === this.selectedYear
      && x.startTime.getMonth() === this.selectedMonth - 1
      && x.startTime.getDate() === this.selectedDay).ToArray();
      this.isOrdersVisible = true;
    });} else {
      this.isOrdersVisible = false;
    }
  }

  minMontChanged() {
    console.log(this.selectedYear);
    if (this.selectedYear === (new Date()).getFullYear()) {
      this.minMonth = ((new Date()).getMonth() + 1);
    } else {
      this.minMonth = 1;
    }
  }

  minDayChanged() {
    console.log(this.selectedMonth);
    if (this.selectedYear === (new Date()).getFullYear() && this.selectedMonth === ((new Date()).getMonth() + 1)) {
      this.minDay =  (new Date()).getDate();
    } else {
      this.minDay = 1;
    }
  }

  minHoursChanged() {
    if (this.selectedYear === (new Date()).getFullYear() && this.selectedMonth === ((new Date()).getMonth() + 1)
      && this.selectedDay === (new Date()).getDate()) {
        this.minHours = (new Date()).getHours();
      } else {
        this.minHours = 9;
      }
  }

  minMinutesChanged() {
    if (this.selectedFinishHours < this.selectedHours) {
      this.selectedFinishHours = this.selectedHours;
      this.minFinishMinutes = this.selectedMinutes;
    }
   if ( this.selectedFinishMinutes < this.selectedMinutes) {
    this.selectedFinishMinutes = this.selectedMinutes;
   }
    if (this.selectedYear === (new Date()).getFullYear() && this.selectedMonth === ((new Date()).getMonth() + 1)
      && this.selectedDay === (new Date()).getDate() &&  this.selectedHours === (new Date()).getHours()) {
        this.minMinutes = (new Date()).getMinutes();
      } else {
        this.minMinutes = 0;
      }
      if (this.selectedHours < this.minHours) {
        this.selectedHours = this.minHours;
      }
  }


  minFinishMinutesChanged() {
    if (this.selectedFinishMinutes <= this.selectedMinutes && this.selectedHours === this.selectedFinishHours) {
     // this.selectedFinishHours = this.selectedHours;
      this.minFinishMinutes = this.selectedMinutes;
      this.selectedFinishMinutes = this.selectedMinutes;
    }  else {
      this.minFinishMinutes = 0;
    }
    if (this.selectedMinutes < this.minMinutes) {
      this.selectedMinutes = this.minMinutes;
    }
  }

  minFinishChanged() {
    if (this.selectedHours < this.selectedFinishHours) {
      this.minFinishMinutes = 0;
    } else {
      this.minFinishMinutes = this.selectedMinutes;
      this.selectedFinishMinutes = this.selectedMinutes;
    }
    if (this.selectedFinishHours < this.selectedHours) {
      this.selectedFinishHours = this.selectedHours;
    }
  }

  minMinFinishChanged() {
    if (this.selectedFinishMinutes < this.minFinishMinutes) {
      this.selectedFinishMinutes = this.minFinishMinutes;
    }
  }

  createWorkplaceOrder() {
    this.isOrdersVisible = false;
    let startTime = new Date();
    startTime.setFullYear(this.selectedYear);
    startTime.setMinutes(this.selectedMonth);
    startTime.setDate(this.selectedDay);
    startTime.setHours(this.selectedHours + 3);
    startTime.setMinutes(this.selectedMinutes);

    let finistTime = new Date();
    finistTime.setFullYear(this.selectedYear);
    finistTime.setMinutes(this.selectedMonth);
    finistTime.setDate(this.selectedDay);
    finistTime.setHours(this.selectedFinishHours + 3);
    finistTime.setMinutes(this.selectedFinishMinutes);

    let workplaceOrder = new WorkplaceOrder();
    workplaceOrder.clientId = this.client.id;
    workplaceOrder.workplaceId = this.workplace.id;
    workplaceOrder.startTime = startTime;
    workplaceOrder.finishTime = finistTime;

    this.apiClient.createWorkplaceOrder(workplaceOrder)
    .subscribe((data: WorkplaceOrder) => {
      if (data.id !== undefined) {
        let text = '';
        this.trans.get('Successful order creation!').subscribe((res: string) => { text += (res + '\n'); } );
        this.trans.get('Total cost is ').subscribe((res: string) => { text += (res + data.sumToPay + ' '); } );
        this.trans.get('grn').subscribe((res: string) => { text += res; } );

        this.creatingResult =  text;
       // this.isOrdersVisible = false;
      } else {
        let text = '';
        this.trans.get('Order creation fails').subscribe((res: string) => { text = res; } );
        this.creatingResult = text;
      }
      console.log(data);
    });
  }

  getClient(): void {
    this.apiClient.getClientById(1)
    .subscribe((data: Client) =>  this.client = data);
  }*/
}
