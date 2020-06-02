import { Equipment, WorkplaceEquipment } from './../api.service';
import { Component, OnInit } from '@angular/core';
import { ViewChild } from "@angular/core";
import { UserService } from "../user.service";
import { Router, ActivatedRoute } from "@angular/router";
import { List } from "linqts";
import { finalize } from "rxjs/operators";
import { APIClient, Workplace } from '../api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-workplace-edit',
  templateUrl: './workplace-edit.component.html',
  styleUrls: ['./workplace-edit.component.css']
})
export class WorkplaceEditComponent implements OnInit {

  workplaceId;
  isRequesting = false;
  workplace: Workplace;
  equipmentList: Equipment[];
  fullEquipmentList: Equipment[];
  selectedNewEquipment: number;
  addButtonShown = false;
  buildingName;

  constructor(
    private apiClient: APIClient,
    private router: Router,
    private userService: UserService, private activateRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.workplaceId = Number.parseFloat(this.activateRoute.snapshot.params['workplaceId']);
    this.buildingName = Number.parseFloat(this.activateRoute.snapshot.params['buildingName']);

    if (this.workplaceId >= 0) {
      this.getData();
    }
  }

  selectNewEquipment() {
    this.addButtonShown = true;
  }

  addWorkplaceEquipment() {
    const newWorkplaceEquipment: WorkplaceEquipment = new WorkplaceEquipment();
    newWorkplaceEquipment.count = 1;
    newWorkplaceEquipment.equipmentId = this.selectedNewEquipment;
    newWorkplaceEquipment.workplaceId = this.workplaceId;

    this.isRequesting = true;

    this.apiClient
      .createWorkplaceEquipment(newWorkplaceEquipment)
      .subscribe((data: WorkplaceEquipment) => {
        this.addButtonShown = false;

        this.getData();
      });
  }

  goToBuildings() {
    this.router.navigate(["/landlord-buildings/"]);
  }

  deleteWorkplaceEquipment(workplaceEquipmentId) {
    this.isRequesting = true;
    this.apiClient.deleteWorkplaceEquipment(workplaceEquipmentId)
      .subscribe((data) => {
        this.getData();
      });
  }

  getWorkplace() {
    this.isRequesting = true;
    this.apiClient.getWorkplaceById(this.workplaceId)
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe((data: Workplace) => {
        this.workplace = data;
        console.log(data);
      });
  }

  goToWorkplaces() {
    this.router.navigate(["/building/workplaces/", this.workplace.buildingId]);

  }

  updateWorkplace() {
    this.isRequesting = true;
    this.apiClient.updateWorkplace(this.workplace)
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe((data) => {
        console.log(data);
      });
  }

  saveWorkplaceEquipment(workplaceEquipment) {
    this.isRequesting = true;
    this.apiClient.updateWorkplaceEquipment(workplaceEquipment)
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe((data) => {
        console.log(data);
      });
  }

  getData() {
    this.isRequesting = true;

    const workplaceQuery = this.apiClient.getWorkplaceById(this.workplaceId);
    const equipmentListQuery = this.apiClient.getEquipmentsList();

    forkJoin([workplaceQuery, equipmentListQuery])
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe((results) => {
        this.workplace = results[0];
        this.equipmentList = [];
        this.fullEquipmentList = results[1];
        for (let i = 0; i < this.fullEquipmentList.length; i++) {
          if (!(this.workplace.workplaceEquipment.filter(
            (e) => e.equipmentId === this.fullEquipmentList[i].id
          ).length > 0)) {
            this.equipmentList.push(this.fullEquipmentList[i]);
          }
        }
      });
  }

}
