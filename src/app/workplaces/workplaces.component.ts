import { Component, OnInit, ViewChild, TemplateRef  } from '@angular/core';
import { APIClient, Workplace, WorkplacePagedResult, Building } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { pipe, forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-workplaces',
  templateUrl: './workplaces.component.html',
  styleUrls: ['./workplaces.component.css']
})
export class WorkplacesComponent implements OnInit {

  buildingId;
  isRequesting = false;
  workplaces: Workplace[];
  page = 1;
  pageCountNumber;
  pageCount;
  building: Building;
  workplaceToDeliteId;

  @ViewChild('content') templateRef: TemplateRef<any>;

  constructor(private apiClient: APIClient,
    private router: Router,
    private userService: UserService, private modalService: NgbModal, private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.buildingId = Number.parseFloat(this.activateRoute.snapshot.params['buildingId']);
    if (this.buildingId >= 0) {
      this.getData();
    }
  }

  loadPage(pageNumber) {
    this.page = pageNumber;
    this.getWorkplacesByBuildingId();
  }

  edit(workplaceId) {
    this.router.navigate(["/workplace-edit/", workplaceId]);
  }

  openDeliteConfirmationWindow(workplaceId) {
    this.workplaceToDeliteId = workplaceId;
    const element: HTMLElement = document.getElementById('myDiv') as HTMLElement;
    element.click();
  }

  open() {
    this.modalService.open(this.templateRef, { ariaLabelledBy: 'modal-basic-title' });
  }

  deleteWorkplace() {
    this.isRequesting = true;
    this.apiClient.deleteWorkplace(this.workplaceToDeliteId)
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe((data) => {
      if (this.workplaces.length == 1 && this.page > 1) {
        this.page = this.page - 1;
      }
      this.workplaceToDeliteId = null;
      this.loadPage(this.page);
    });
  }

  getData() {
    this.isRequesting = true;

    const workplacesQuery = this.apiClient.getPagedWorkplacesByBuildingId(this.buildingId, this.page);
    const buildingQuiery = this.apiClient.getBuildingById(this.buildingId);

    forkJoin([workplacesQuery, buildingQuiery])
      .pipe(finalize(() => (this.isRequesting = false)))

      .subscribe((results) => {

        this.workplaces = results[0].workplaces;
        console.log(this.workplaces);
        this.pageCountNumber = results[0].totalCount;
        this.pageCount = Array(results[0].totalCount).fill(0).map((x, i) => i + 1);

        this.building =  results[1];
      });
  }

  getWorkplacesByBuildingId() {
    this.isRequesting = true;
    this.apiClient.getPagedWorkplacesByBuildingId(this.buildingId, this.page)
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe((data: WorkplacePagedResult) => {
      this.workplaces = data.workplaces;
      this.pageCountNumber = data.totalCount;

      this.pageCount = Array(data.totalCount).fill(0).map((x, i) => i + 1);
    });
  }
}
