import { SearchingModel, SearchingViewModel } from './../api.service';
import { Component, OnInit } from '@angular/core';
import { APIClient, Equipment } from '../api.service';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-workspace-parameters',
  templateUrl: './workspace-parameters.component.html',
  styleUrls: ['./workspace-parameters.component.css']
})
export class WorkspaceParametersComponent implements OnInit {

  ratingClicked: number;
  itemIdRatingClicked: string;
  searchingViewModel: SearchingViewModel;

  isRequesting;
  equipmentList;

  constructor(private apiClient: APIClient) {
  }

  ngOnInit() {
    this.getEquipmentsList();
  }

  getEquipmentsList(): void {
    this.isRequesting = true;

    this.apiClient.getEquipmentsList()
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: Equipment[]) => {
      this.equipmentList = data;
      if (!localStorage.getItem('searchingViewModel')) {
        this.searchingViewModel = new SearchingViewModel();
        this.searchingViewModel.x = 33;
        this.searchingViewModel.y = 33;
        this.searchingViewModel.searchingModel = [];
      } else {
        this.searchingViewModel = JSON.parse(localStorage.getItem('searchingViewModel'));
      }
      console.log( this.searchingViewModel);
      for (const equipment of this.searchingViewModel.searchingModel) {
        this.ratingComponentClick(equipment, equipment);
      }
    }
      );
  }

  ratingComponentClick(clickObj: any, searchingModel?: SearchingModel): void {
    let item;
    if (searchingModel) {
      console.log(searchingModel);
      item = this.equipmentList.find(((i: Equipment) => i.id === searchingModel.equipmentId));
      item.id = searchingModel.equipmentId;
      item.rating = parseFloat((searchingModel.importancy  / 0.2).toFixed());
      this.ratingClicked = searchingModel.importancy;
    } else {

      item = this.equipmentList.find(((i: Equipment) => i.id === clickObj.itemId));
      item.rating = clickObj.rating;

      this.ratingClicked = clickObj.rating;
      this.itemIdRatingClicked = item.company;

      const newSearchingModel = new SearchingModel();
      newSearchingModel.equipmentId = clickObj.itemId;
      newSearchingModel.importancy = parseFloat((clickObj.rating * 0.2).toFixed(3));

      let isExists = false;
      for (const searchItem of this.searchingViewModel.searchingModel) {
        if (searchItem.equipmentId === newSearchingModel.equipmentId) {
          searchItem.importancy = newSearchingModel.importancy;
          isExists = true;
          break;
         }
      }
      if (!isExists) {
        this.searchingViewModel.searchingModel.push(newSearchingModel);
      }
      console.log(this.searchingViewModel);
      localStorage.setItem('searchingViewModel', JSON.stringify(this.searchingViewModel));
    }
    }

    save() {
     // this.searchingViewModel.wantedCost = cost;
      localStorage.setItem('searchingViewModel', JSON.stringify(this.searchingViewModel));

    }

  }

