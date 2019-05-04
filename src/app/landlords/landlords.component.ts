import { Component, OnInit } from '@angular/core';
import { APIClient, Landlord } from '../api.service';


@Component({
  selector: 'app-landlords',
  templateUrl: './landlords.component.html',
  styleUrls: ['./landlords.component.css']
})
export class LandlordsComponent implements OnInit {

  landlordsGreenList: Landlord[] = [];
  landlordsBlackList: Landlord[] = [];

  constructor(private apiClient: APIClient) { }

  ngOnInit() {
    this.getLandlordsList();
  }

  getLandlordsList() {
    this.apiClient.getLandlordsList()
    .subscribe((data: Landlord[]) => {
      this.landlordsGreenList = data.filter(x => x.isInBlackList === 0);
      this.landlordsBlackList = data.filter(x => x.isInBlackList === 1);
    });
  }



}
