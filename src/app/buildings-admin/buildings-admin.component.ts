import { Component, OnInit } from '@angular/core';
import { APIClient, Building, Landlord } from '../api.service';


@Component({
  selector: 'app-buildings-admin',
  templateUrl: './buildings-admin.component.html',
  styleUrls: ['./buildings-admin.component.css']
})
export class BuildingsAdminComponent implements OnInit {

  buildingsList: Building[] = [];
  building: Building;
  landlordsList: Landlord[] = [];
  isUpdate = false;
  isCreate = false;
  isUsed = false;

  constructor(private apiClient: APIClient) { }

  ngOnInit() {
    this.getBuildingList();
    this.getLandlordsList();
  }

  getBuildingList() {
    this.apiClient.getBuildingsList()
    .subscribe((data: Building[]) => {
      this.buildingsList = data;
    });
  }

  getLandlordsList() {
    this.apiClient.getLandlordsList()
    .subscribe((data: Landlord[]) => {
      this.landlordsList = data;
    });
  }

  updateBuilding(building: Building): void {
    this.building = building;
    this.isCreate = false;
    this.isUpdate = true;
    this.isUsed = true;
  }

  onUpdate(building: Building): void {
    this.apiClient.updateBuilding(building)
    .subscribe(result => {
      this.ngOnInit();
      this.isUsed = false;
     });
   }

   createBuilding(): void {
    this.building = new Building();
    this.isUpdate = false;
    this.isUsed = true;
    this.isCreate = true;
  }

  onCreate(building: Building): void {
    this.apiClient.createBuilding(building)
    .subscribe(result => {
      this.ngOnInit();
      this.isUsed = false;
     });
   }

   deleteBuilding(buildingId: number): void {
    this.apiClient.deleteBuilding(buildingId)
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
