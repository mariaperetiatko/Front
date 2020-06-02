import { LandlordAccountComponent } from './../landlord-account/landlord-account.component';
import { Component, OnInit } from '@angular/core';
import { APIClient, Building, Workplace, WorkplaceEquipment, Equipment, Landlord } from '../api.service';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-workplace-admin',
  templateUrl: './workplace-admin.component.html',
  styleUrls: ['./workplace-admin.component.css']
})
export class WorkplaceAdminComponent implements OnInit {

  workplacesList: Workplace[] = [];
  workplace: Workplace = new Workplace();
  buildingsList: Building[] = [];
  isUpdate = false;
  isCreate = false;
  isUsed = false;
  workplaceEquipmentsList: WorkplaceEquipment[] = [];
  apprEqupment: Equipment[] = [];
  workplId: number;
  isEq = false;
  eqList: Equipment[] = [];
  eqId: number;
  isRequesting = false;
  landlordsList: Landlord[]=[];
  constructor(private apiClient: APIClient) { }

  ngOnInit() {
    this.getWorkplacesList();
    this.getBuildingsList();
    this.getWorkplaceEquipmentList();
    this.getEquipmentsList();
  }



  getWorkplacesList() {
    this.isRequesting = true;

    this.apiClient.getWorkplacesList()
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe((data: Workplace[]) => {
      this.workplacesList = data;
    });
  }

  getEquipmentsList() {
    this.isRequesting = true;

    this.apiClient.getEquipmentsList()
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe((data: Equipment[]) => {
      this.eqList = data;
    });
  }

  getEquipmentByWorkplace(workplaceId: number) {
    this.isRequesting = true;

    this.isEq = true;

    this.workplId = workplaceId;
    const appropriateWorkplaceOrders = this.workplaceEquipmentsList.filter(x => x.workplaceId === workplaceId);
    this.apprEqupment = [];
    for (const item of appropriateWorkplaceOrders) {
      this.apiClient.getEquipmentById(item.equipmentId)
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe((data: Equipment) => {
        this.apprEqupment.push(data);
      });
    }
  }

  getWorkplaceEquipmentList() {
    this.isRequesting = true;

    this.apiClient.getWorkplaceEquipmentsList()
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe((data: WorkplaceEquipment[]) => {
      this.workplaceEquipmentsList = data;
    });
  }

  getBuildingsList() {
    this.isRequesting = true;

    this.apiClient.getBuildingsList()
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe((data: Building[]) => {
      this.buildingsList = data;
      if(this.buildingsList.length>0)
      this.workplace.buildingId =  this.buildingsList[0].id;
    });
  }

  updateWorkplace(workplace: Workplace): void {
    this.workplace = workplace;
    this.isCreate = false;
    this.isUpdate = true;
    this.isUsed = true;
  }

  onUpdate(workplace: Workplace): void {
    this.isRequesting = true;

    this.apiClient.updateWorkplace(workplace)
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe(result => {
      this.ngOnInit();
      this.isUsed = false;
     });
   }

   createWorkplace(): void {
   // this.workplace = new Workplace();
    this.isUpdate = false;
    this.isUsed = true;
    this.isCreate = true;
  }

  onCreate(workplace: Workplace): void {
    this.isRequesting = true;

console.log(workplace);
    this.apiClient.createWorkplace(workplace)
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe(result => {
      this.ngOnInit();
      this.isUsed = false;
     });
   }

   deleteWorkplace(workplaceId: number): void {
    this.isRequesting = true;

    this.apiClient.deleteWorkplace(workplaceId)
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe(result => {
      this.ngOnInit();
      this.hide();
    });
  }

  hide(): void {
    this.isUpdate = false;
    this.isUsed = false;
    this.isCreate = false;
    this.isEq = false;
  }

  deleteEquipmentFromWorkplace(equipmentId: number) {
    this.isRequesting = true;

    const workEq: WorkplaceEquipment = this.workplaceEquipmentsList.find(x => x.workplaceId === this.workplId
      && x.equipmentId === equipmentId);
    this.apiClient.deleteWorkplaceEquipment(workEq.id)
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe(result => {
      this.hide();
      this.ngOnInit();

    });
  }

  createWorkplaceEquipment() {
    this.isRequesting = true;

    const workeq = new WorkplaceEquipment();
    workeq.equipmentId = this.eqId;
    workeq.workplaceId = this.workplId;
    this.apiClient.createWorkplaceEquipment(workeq)
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe(result => {
      this.hide();
      this.ngOnInit();
    });
  }
}
