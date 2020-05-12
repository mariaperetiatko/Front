import {
  SearchingModel,
  SearchingViewModel,
  WorkplaceParameter,
  SearchSetting,
} from "./../api.service";
import { Component, OnInit } from "@angular/core";
import { APIClient, Equipment, CurseValues } from "../api.service";
import { finalize } from "rxjs/operators";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-workspace-parameters",
  templateUrl: "./workspace-parameters.component.html",
  styleUrls: ["./workspace-parameters.component.css"],
})
export class WorkspaceParametersComponent implements OnInit {
  ratingClicked: number;
  itemIdRatingClicked: string;
  searchingViewModel: SearchingViewModel;
  curse: CurseValues[] = [];
  isRequesting;
  fullEquipmentList: Equipment[];
  selectedCurse = 2;
  curseCoef = 1;
  cost: number;
  long: number;
  longCoef = 1;
  selectedLong = 0;
  selectedNewEquipment: number;
  workplaceParametersList: WorkplaceParameter[];
  addButtonShown = false;
  equipmentList: Equipment[] = [];
  searchSetting: SearchSetting;
  isSettingRequesting = false;
  isWorkplaceParametersRequesting = false;

  constructor(private apiClient: APIClient) {}

  ngOnInit() {
    this.getValues();
    this.getClientsWorkplaceParameters();
    this.getSearchSetting();
  }

  getSearchSetting() {
    this.isSettingRequesting = true;

    this.apiClient
      .getSearchSetting()
      .pipe(finalize(() => (this.isSettingRequesting = false)))
      .subscribe((data: SearchSetting) => {
        this.searchSetting = data;
        this.cost = this.searchSetting.wantedCost;
        this.long = this.searchSetting.radius;
      });
  }

  getEquipmentNameById(id): string {
    const index: number = this.findWithAttr(this.fullEquipmentList, "id", id);

    return this.fullEquipmentList[index].name;
  }

  selectNewEquipment() {
    this.addButtonShown = true;
  }

  addWorkplaceParameter() {
    const newWorkplaceParameter: WorkplaceParameter = new WorkplaceParameter();
    newWorkplaceParameter.clientId = -1;
    newWorkplaceParameter.equipmentId = this.selectedNewEquipment;
    newWorkplaceParameter.count = 1;
    newWorkplaceParameter.priority = 3;

    this.isRequesting = true;

    this.apiClient
      .createWorkplaceParameter(newWorkplaceParameter)
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe((data: WorkplaceParameter) => {
        this.addButtonShown = false;

        const index: number = this.findWithAttr(
          this.equipmentList,
          "id",
          this.selectedNewEquipment
        );
        this.selectedNewEquipment = -1;
        if (index !== -1) {
          this.equipmentList.splice(index, 1);
        }

        this.workplaceParametersList.push(data);
      });
  }

  findWithAttr(array, attr, value) {
    for (let i = 0; i < array.length; i += 1) {
      if (array[i][attr] == value) {
        return i;
      }
    }
    return -1;
  }

  getClientsWorkplaceParameters() {
    this.isRequesting = true;

    const workplaceParams = this.apiClient.getClientsWorkplaceParameters();
    const equipmentList = this.apiClient.getEquipmentsList();

    forkJoin([workplaceParams, equipmentList])
      .pipe(finalize(() => (this.isRequesting = false)))

      .subscribe((results) => {
        this.workplaceParametersList = results[0];
        this.equipmentList = [];
        this.equipmentList = [];
        this.fullEquipmentList = results[1];
        for (let i = 0; i < this.fullEquipmentList.length; i++) {
          if (
            !(
              this.workplaceParametersList.filter(
                (e) => e.equipmentId === this.fullEquipmentList[i].id
              ).length > 0
            )
          ) {
            this.equipmentList.push(this.fullEquipmentList[i]);
          }
        }
      });
  }

  updateWorkplaceParameter(item) {
    this.isRequesting = true;

    this.apiClient
      .updateWorkplaceParameter(item)
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe(() => console.log("yes"));
  }

  deleteWorkplaceParameter(workplaceParameter) {
    this.isRequesting = true;

    this.apiClient
      .deleteWorkplaceParameter(workplaceParameter.id)
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe(() => {
        const workplaceIndex: number = this.findWithAttr(
          this.workplaceParametersList,
          "id",
          workplaceParameter.id
        );
        if (workplaceIndex !== -1) {
          this.workplaceParametersList.splice(workplaceIndex, 1);
        }

        const equipmentIndex: number = this.findWithAttr(
          this.fullEquipmentList,
          "id",
          workplaceParameter.equipmentId
        );
        if (equipmentIndex !== -1) {
          this.equipmentList.push(this.fullEquipmentList[equipmentIndex]);
        }
      });
  }

  ratingComponentClick(clickObj: any, searchingModel?: SearchingModel): void {
    const item = this.workplaceParametersList.find(
      (i: WorkplaceParameter) => i.id === clickObj.itemId
    );
    console.log(item);
    if (item) {
      item.priority = clickObj.rating;
    }
  }

  updateSearchSetting() {
    this.searchSetting.wantedCost = this.cost * this.curseCoef;
    this.searchSetting.radius = this.long / this.longCoef;
    this.isRequesting = true;
    console.log(this.searchSetting);
    this.apiClient.updateSearchSetting(this.searchSetting).subscribe((res) => {
      this.isRequesting = false;
    });
  }

  getValues(): void {
    this.apiClient.getCurseValues().subscribe((res) => {
      console.log(JSON.stringify(res));
      this.curse = <CurseValues[]>JSON.parse(JSON.stringify(res));
      this.selectedCurse = 2;
      this.selectedLong = 0;
    });
  }

  changedClickLong(index: number) {
    if (index == 0) {
      this.long = this.searchSetting.radius;
      this.longCoef = 1;
      this.selectedLong = 0;
    } else {
      this.longCoef = 1.609;
      this.long = this.searchSetting.radius * this.longCoef;
      this.selectedLong = 1;
    }
  }

  changedClickCusre(index: number) {
    if (index == 2) {
      this.cost = this.searchSetting.wantedCost;
      this.curseCoef = 1;
      this.selectedCurse = index;
    } else {
      this.curseCoef = this.curse[index].buy;
      this.cost = this.searchSetting.wantedCost / this.curseCoef;
      this.selectedCurse = index;
    }
  }
}
