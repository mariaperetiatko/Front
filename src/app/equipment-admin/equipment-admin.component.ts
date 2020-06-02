import { Component, OnInit } from '@angular/core';
import { APIClient, Equipment, Workplace } from '../api.service';
import { finalize } from 'rxjs/operators';


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
  isRequesting = false;
  isNameValid = false;
  constructor(private apiClient: APIClient) { }

  ngOnInit() {
    this.getEquipmentList();
  }

  getEquipmentList() {
    this.isRequesting = true;
    this.apiClient.getEquipmentsList()
    .pipe(finalize(() => (this.isRequesting = false)))
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
    this.isRequesting = true;
    this.apiClient.updateEquipment(equipment)
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe(result => {
      this.ngOnInit();
      this.isUsed = false;
     });
   }

   checkValue() {
    if(this.equipmentList.filter(e => e.name === this.equipment.name).length > 0 || this.equipment.name=='')
    this.isNameValid = false;
    else
    this.isNameValid = true;

  }
   createEquipment(): void {
    this.equipment = new Equipment();
    this.isUpdate = false;
    this.isUsed = true;
    this.isCreate = true;
  }

  onCreate(equipment: Equipment): void {
    this.isRequesting = true;
    this.apiClient.createEquipment(equipment)
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe(result => {
      this.ngOnInit();
      this.isUsed = false;
     });
   }

   deleteEquipment(equipmentId: number): void {
    this.isRequesting = true;
    this.apiClient.deleteEquipment(equipmentId)
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
  }

}
