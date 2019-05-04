/// <reference types="@types/googlemaps" />
import { FindedWorkplace, Workplace, SearchingViewModel, APIClient, Building } from './../api.service';
import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { List } from 'linqts';


@Component({
  selector: 'app-map-search',
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.css']
})
export class MapSearchComponent implements AfterContentInit {

  worlplacesList: List<Workplace> = new List<Workplace>();
  findedWorkplacesList: FindedWorkplace[];
  locationMarker: google.maps.Marker = new google.maps.Marker();
  searchingViewModel: SearchingViewModel;
  gmarkers = [];
  workplacesByBuilding: Workplace[] = [];
  selectedBuilding: Building = new Building();

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  latitude: any;
  longitude: any;
  isHidden = false;

  iconBase = 'http://maps.google.com/mapfiles/kml/pushpin/';

  markerTypes = [
    {
      text: 'Restaurant', value: 'ylw-pushpin.png'
    }
  ];
  selectedMarkerType = 'ylw-pushpin.png';


 constructor(private apiClient: APIClient, private router: Router,  private userService: UserService) { }

  ngAfterContentInit() {
    this.getFindedWorkplacesList();
    const mapProp = {
      center: new google.maps.LatLng(49.947621500, 36.305090299),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }


  setMapType(mapTypeId: string) {
    this.map.setMapTypeId(mapTypeId);
  }

  toggleMap() {
    this.isHidden = !this.isHidden;
    this.gmapElement.nativeElement.hidden = this.isHidden;
  }

  getFindedWorkplacesList() {
    this.searchingViewModel = JSON.parse(localStorage.getItem('searchingViewModel'));

    this.apiClient.searcForWorcplaces(this.searchingViewModel)
    .subscribe((data: FindedWorkplace[]) => {
      this.findedWorkplacesList = data;
      for (const item of this.findedWorkplacesList) {
        this.apiClient.getWorkplaceById(item.workplaceId)
        .subscribe((workplace: Workplace) => {
          this.worlplacesList.Add(workplace);
        });
      }
      console.log(this.findedWorkplacesList);
    });
  }

  setCurrentPosition() {
    if ('geolocation' in navigator) {
      this.locationMarker.setMap(null);
      this.locationMarker = null;
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
      this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));

      const location = new google.maps.LatLng(this.latitude, this.longitude);

      const marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: 'Got you!'
      });

      this.locationMarker = marker;

    }
  }

  setCenter(latitude: number, longitude: number) {
    this.locationMarker.setMap(null);
    this.locationMarker = null;
    this.map.setCenter(new google.maps.LatLng(latitude, longitude));

    const location = new google.maps.LatLng(latitude, longitude);

    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: 'Got you!'
    });
    this.locationMarker = marker;

    marker.addListener('click', this.simpleMarkerHandler);

    marker.addListener('click', () => {
      this.markerHandler(marker);
    });
  }

  markerHandler(marker: google.maps.Marker) {
    alert('Marker\'s Title: ' + marker.getTitle() + 'pos      ' + marker.getPosition());
  }

  simpleMarkerHandler() {
    alert('Simple Component\'s function...');
  }

  showWorkplace(workplace: Workplace) {

    // this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
    let building: Building;
    console.log('jsndjsnfjsnfs');
    console.log(workplace);
     this.apiClient.getBuildingById(workplace.buildingId)
     .subscribe((data: Building) => {
        building = data;


     const location = new google.maps.LatLng(building.x, building.y);

     // console.log(`selected marker: ${this.selectedMarkerType}`);

     const marker = new google.maps.Marker({
       position: location,
       map: this.map,
       icon: this.iconBase + this.selectedMarkerType,
       title: building.country
     });
     this.gmarkers.push(marker);     // marker.addListener('click', this.simpleMarkerHandler);

     marker.addListener('click', () => {
       this.buildingHendler(building, marker);
     });});
   }

  buildingHendler(building: Building, marker: google.maps.Marker): void {
    // const restaurantJson = restaurant.toJSON();
    this.selectedBuilding = building;
    this.workplacesByBuilding = this.worlplacesList.Where(x => x.buildingId === building.id).ToArray();
  };

  navigateToWorkplace(workpl: Workplace) {
    localStorage.setItem('selectedWorkplace', JSON.stringify(workpl));
    this.router.navigate(['/workplace']);
  }

  showAppropriate() {
    console.log(this.worlplacesList.ElementAt(0));
    for (let i = 0; i < this.worlplacesList.Count(); i++) {
      this.showWorkplace(this.worlplacesList.ElementAt(i));
    }
  }

  getFindedWorkplaceById(id: number):  FindedWorkplace{
    return this.findedWorkplacesList.find(x => x.workplaceId === id);
  }

}
