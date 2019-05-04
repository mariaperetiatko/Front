import { Component, OnInit } from '@angular/core';
import { APIClient, Building, Workplace, WorkplaceEquipment, Equipment } from '../api.service';


@Component({
  selector: 'app-workplace-admin',
  templateUrl: './workplace-admin.component.html',
  styleUrls: ['./workplace-admin.component.css']
})
export class WorkplaceAdminComponent implements OnInit {

  workplacesList: Workplace[] = [];
  workplace: Workplace;
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

  constructor(private apiClient: APIClient) { }

  ngOnInit() {
    this.getWorkplacesList();
    this.getBuildingsList();
    this.getWorkplaceEquipmentList();
    this.getEquipmentsList();
  }

  getWorkplacesList() {
    this.apiClient.getWorkplacesList()
    .subscribe((data: Workplace[]) => {
      this.workplacesList = data;
    });
  }

  getEquipmentsList() {
    this.apiClient.getEquipmentsList()
    .subscribe((data: Equipment[]) => {
      this.eqList = data;
    });
  }

  getEquipmentByWorkplace(workplaceId: number) {
    this.isEq = true;

    this.workplId = workplaceId;
    const appropriateWorkplaceOrders = this.workplaceEquipmentsList.filter(x => x.workplaceId === workplaceId);
    this.apprEqupment = [];
    for (const item of appropriateWorkplaceOrders) {
      this.apiClient.getEquipmentById(item.equipmentId)
      .subscribe((data: Equipment) => {
        this.apprEqupment.push(data);
      });
    }
  }

  getWorkplaceEquipmentList() {
    this.apiClient.getWorkplaceEquipmentsList()
    .subscribe((data: WorkplaceEquipment[]) => {
      this.workplaceEquipmentsList = data;
    });
  }

  getBuildingsList() {
    this.apiClient.getBuildingsList()
    .subscribe((data: Building[]) => {
      this.buildingsList = data;
    });
  }

  updateWorkplace(workplace: Workplace): void {
    this.workplace = workplace;
    this.isCreate = false;
    this.isUpdate = true;
    this.isUsed = true;
  }

  onUpdate(workplace: Workplace): void {
    this.apiClient.updateWorkplace(workplace)
    .subscribe(result => {
      this.ngOnInit();
      this.isUsed = false;
     });
   }

   createWorkplace(): void {
    this.workplace = new Workplace();
    this.isUpdate = false;
    this.isUsed = true;
    this.isCreate = true;
  }

  onCreate(workplace: Workplace): void {
    this.apiClient.createWorkplace(workplace)
    .subscribe(result => {
      this.ngOnInit();
      this.isUsed = false;
     });
   }

   deleteWorkplace(workplaceId: number): void {
    this.apiClient.deleteWorkplace(workplaceId)
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
    const workEq: WorkplaceEquipment = this.workplaceEquipmentsList.find(x => x.workplaceId === this.workplId
      && x.equipmentId === equipmentId);
    this.apiClient.deleteWorkplaceEquipment(workEq.id)
    .subscribe(result => {
      this.hide();
      this.ngOnInit();

    });
  }

  createWorkplaceEquipment() {
    const workeq = new WorkplaceEquipment();
    workeq.equipmentId = this.eqId;
    workeq.workplaceId = this.workplId;
    this.apiClient.createWorkplaceEquipment(workeq)
    .subscribe(result => {
      this.hide();
      this.ngOnInit();
    });
  }
}
