import { Component, OnInit } from '@angular/core';
import { Workplace, Client, APIClient, WorkplaceOrder, WorkplaceEquipment, Equipment, Building, Landlord } from './../api.service';
import { List } from 'linqts';


@Component({
  selector: 'app-workplace',
  templateUrl: './workplace.component.html',
  styleUrls: ['./workplace.component.css']
})

export class WorkplaceComponent implements OnInit {

  client: Client;
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

  constructor(private apiClient: APIClient) { }

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
        this.creatingResult = 'Successful order creation!\n Total cost is ' + data.sumToPay + ' grn';
       // this.isOrdersVisible = false;
      } else {
        this.creatingResult = 'Order creation fails!\nSelected time period is busy!';
      }
      console.log(data);
    });
  }

  getClient(): void {
    this.apiClient.getClientById(0)
    .subscribe((data: Client) =>  this.client = data);
  }

}
