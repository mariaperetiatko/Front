import { Component, OnInit } from '@angular/core';
import { APIClient, Equipment, Workplace } from '../api.service';


@Component({
  selector: 'app-equipment-admin',
  templateUrl: './equipment-admin.component.html',
  styleUrls: ['./equipment-admin.component.css']
})
export class EquipmentAdminComponent implements OnInit {

  equipmentList: Equipment[] = [];
  equipment: Equipment;
  isUpdate = false;
  isCreate = false;
  isUsed = false;

  constructor(private apiClient: APIClient) { }

  ngOnInit() {
    this.getEquipmentList();
  }

  getEquipmentList() {
    this.apiClient.getEquipmentsList()
    .subscribe((data: Equipment[]) => {
      this.equipmentList = data;
    });
  }

  updateEquipment(equipment: Equipment): void {
    this.equipment = equipment;
    this.isCreate = false;
    this.isUpdate = true;
    this.isUsed = true;
  }

  onUpdate(equipment: Equipment): void {
    this.apiClient.updateEquipment(equipment)
    .subscribe(result => {
      this.ngOnInit();
      this.isUsed = false;
     });
   }

   createEquipment(): void {
    this.equipment = new Equipment();
    this.isUpdate = false;
    this.isUsed = true;
    this.isCreate = true;
  }

  onCreate(equipment: Equipment): void {
    this.apiClient.createEquipment(equipment)
    .subscribe(result => {
      this.ngOnInit();
      this.isUsed = false;
     });
   }

   deleteEquipment(equipmentId: number): void {
    this.apiClient.deleteEquipment(equipmentId)
    .subscribe(result => {
      this.ngOnInit();
      this.hide();
    });
  }

  hide(): void {
    this.isUpdate = false;
    this.isUsed = false;
    this.isCreate = false;
  }

}
