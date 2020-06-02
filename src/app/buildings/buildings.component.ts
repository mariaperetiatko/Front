import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { APIClient, Building, Workplace, Landlord, BuildingSearchingResult, WorkplaceSearchingResult } from '../api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.css']
})
export class BuildingsComponent implements OnInit {

  workplacesList: Workplace[] = [];
  buildingList: Building[] = [];
  filteredBuildingList: Building[] = [];
  countries: string[] = [];
  cities: string[] = [];
  streets: string[] = [];
  isRequesting = true;
  isWorkplaceVisibleArray: Boolean[];
  landlordsList: Landlord[] = [];
  appropriatationList: BuildingSearchingResult;

  constructor(private apiClient: APIClient, private router: Router) { }

  visitWorkplace(workplaceId) {
    this.router.navigate(["/buildings/workplace/", workplaceId]);
  }


  ngOnInit() {
    this.apiClient.getLandlordsList()
    .subscribe((data: Landlord[]) => {
      this.landlordsList = data;
    })
    this.apiClient.getBuildingsList()
    .subscribe((data: Building[]) => {
      this.buildingList = this.filteredBuildingList = data;
      this.isRequesting = false;
      this.countries = Array.from(new Set( this.filteredBuildingList.map(a => a.country)));
      this.cities = Array.from(new Set(this.filteredBuildingList.map(a => a.city)));
      this.streets = Array.from(new Set(this.filteredBuildingList.map(a => a.street)));
      this.isWorkplaceVisibleArray = new Array<Boolean>(data.length);
    });
    this. getWorkplacesList();
  }

  getAppropriationByBuildingResults(buildingId: number) {
    this.apiClient.getAppropriationByBuildingResults(buildingId)
    .subscribe((data: BuildingSearchingResult) => {
      this.appropriatationList = data;
      console.log(data);
    })
  }

  filter(country: string, city: string, street: string) {
    const notFilter = (country === '' && city === '' && street === '');
    const countryFilter = (country !== '' && city === '' && street === '');
    const cityFilter = (country === '' && city !== '' && street === '');
    const streetFilter = (country === '' && city === '' && street !== '');
    const countryCityFilter = (country !== '' && city !== '' && street === '');
    const countryStreetFilter = (country !== '' && city === '' && street !== '');
    const cityStreetFilter = (country === '' && city !== '' && street !== '');
    const countrySityStreetFilter = (country !== '' && city !== '' && street !== '');
    if (notFilter) {
      this.filteredBuildingList = this.buildingList;
    } else if (countryFilter) {
      this.cities = Array.from(new Set(this.buildingList.filter(x => x.country === country).map(a => a.city)));
      this.filteredBuildingList = this.buildingList.filter(x => x.country === country);
    } else if (cityFilter) {
      this.streets = Array.from(new Set(this.buildingList.filter(x => x.city === city).map(a => a.street)));
      this.filteredBuildingList = this.buildingList.filter(x => x.city === city);
    } else if (streetFilter) {
      this.filteredBuildingList = this.buildingList.filter(x => x.street === street);
    } else if (countryCityFilter) {
      this.streets = Array.from(new Set(this.buildingList.filter(x => x.city === city && x.country === country).map(a => a.street)));
      this.filteredBuildingList = this.buildingList.filter(x => x.country === country && x.city === city);
    } else if (countryStreetFilter) {
      this.cities = Array.from(new Set(this.buildingList.filter(x => x.country === country).map(a => a.city)));
      this.streets = Array.from(new Set(this.buildingList.filter(x => x.city === city && x.country === country).map(a => a.street)));
      this.filteredBuildingList = this.buildingList.filter(x => x.country === country &&  x.street === street);
    } else if (cityStreetFilter) {
      this.filteredBuildingList = this.buildingList.filter(x => x.city === city && x.street === street);
    } else if (countrySityStreetFilter) {
      this.streets = Array.from(new Set(this.buildingList.filter(x => x.city === city && x.country === country).map(a => a.street)));
    this.filteredBuildingList = this.buildingList.filter(x => x.country === country
      && x.city === city && x.street === street);
    }
    // this.countries = Array.from(new Set(this.filteredBuildingList.map(a => a.country)));
    //this.cities = Array.from(new Set(this.filteredBuildingList.map(a => a.city)));
    //this.streets = Array.from(new Set(this.filteredBuildingList.map(a => a.street)));
    this.isWorkplaceVisibleArray = new Array<Boolean>(this.filteredBuildingList.length);

  }

  getWorkplacesList() {
    this.apiClient.getWorkplacesList()
    .subscribe((data: Workplace[]) => {
      this.workplacesList = data;
    });
  }

  showWorkplaceBuilding(i: number): void {
    if (!this.isWorkplaceVisibleArray[i]) {
      this.isWorkplaceVisibleArray[i] = true;
    } else {
      this.isWorkplaceVisibleArray[i] = false;
    }
  }

  getWorkplacesInBuilding(buildingId: number): Workplace[] {
    return this.workplacesList.filter(x => x.buildingId === buildingId);
  }

  navigateToWorkplace(workpl: Workplace) {
    localStorage.setItem('selectedWorkplace', JSON.stringify(workpl));
    this.router.navigate(['/workplace']);
  }

  showLandlordByBuilding(building: Building): string {
    const landlord: Landlord = this.landlordsList.find(x => x.id === building.landlordId);
    return landlord.firstName + ' ' + landlord.lastName;
  }
}
