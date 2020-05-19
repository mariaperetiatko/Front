import { Component, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Building, APIClient } from '../api.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-landlord-buildings',
  templateUrl: './landlord-buildings.component.html',
  styleUrls: ['./landlord-buildings.component.css']
})
export class LandlordBuildingsComponent implements OnInit {

  buildings: Building[];
  isRequesting = false;
  buildingToDeliteId;

  @ViewChild('content') templateRef: TemplateRef<any>;

  constructor(private apiClient: APIClient, private router: Router, private userService: UserService, private modalService: NgbModal) { }

  ngOnInit() {
    this.getBuildings();
  }

  goToCreatePage() {
    this.router.navigate(["/building-create/"]);
  }

  goToUpdatePage(buildingId) {
    this.router.navigate(["/building-edit/", buildingId]);
  }

  goToWorkplacesPage(buildingId) {
    this.router.navigate(["/building/workplaces/", buildingId]);
  }

  getBuildings() {
    this.isRequesting = true;

    this.apiClient.getBuildingsByLandlord()
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe((data: Building[]) => {
        this.buildings = data;
      }
      )
  };

  openDelitionPopup(buildingId: number) {
    console.log(buildingId);
    this.buildingToDeliteId = buildingId;
    const element: HTMLElement = document.getElementById('myDiv') as HTMLElement;
    element.click();
  }

  deleteBuilding() {
    this.isRequesting = true;

    this.apiClient.deleteBuilding(this.buildingToDeliteId)
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe((data) => {
        this.buildingToDeliteId = null;
        this.getBuildings();
      }
      )
  }

  open() {
    this.modalService.open(this.templateRef, { ariaLabelledBy: 'modal-basic-title' });
  }


}
