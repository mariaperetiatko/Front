/// <reference types="@types/googlemaps" />
import {
  FindedWorkplace,
  Workplace,
  SearchingViewModel,
  APIClient,
  Building,
  BuildingSearchingResult
} from "./../api.service";
import { Component, OnInit, AfterContentInit } from "@angular/core";
import { ViewChild } from "@angular/core";
import { UserService } from "../user.service";
import { Router } from "@angular/router";
import { List } from "linqts";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-map-search",
  templateUrl: "./map-search.component.html",
  styleUrls: ["./map-search.component.css"],
})
export class MapSearchComponent implements AfterContentInit {
  //worlplacesList: List<BuildingSearchingResult> = new List<BuildingSearchingResult>();
  findedWorkplacesList: FindedWorkplace[];
  locationMarker: google.maps.Marker = new google.maps.Marker();
  searchingViewModel: SearchingViewModel;
  gmarkers = [];
  workplacesByBuilding: Workplace[] = [];
  selectedBuilding: Building = new Building();
  buildingSearchingResults: BuildingSearchingResult[];
  isRequesting = false;
  buildingToShow: BuildingSearchingResult;

  @ViewChild("gmap") gmapElement: any;
  map: google.maps.Map;

  latitude: any;
  longitude: any;
  isHidden = false;

  iconBase = "http://maps.google.com/mapfiles/kml/pushpin/";

  markerTypes = [
    {
      text: "Restaurant",
      value: "ylw-pushpin.png",
    },
  ];
  selectedMarkerType = "ylw-pushpin.png";

  autocompletes;
  marker;
  infowindow;
  markers = [];
  searchBox;
  isOneBuildingShown = false;
  constructor(
    private apiClient: APIClient,
    private router: Router,
    private userService: UserService
  ) {}

  ngAfterContentInit() {
    //this.getFindedWorkplacesList();
    const mapProp = {
      center: new google.maps.LatLng(50.01509, 36.22864),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    this.markers = [];
    const inputs = document.getElementById("address") as HTMLInputElement;
    this.searchBox = new google.maps.places.SearchBox(inputs);
    console.log(this.searchBox);

    this.map.addListener("bounds_changed", this.boundsListener.bind(this));

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.

    this.searchBox.addListener(
      "places_changed",
      this.searchListener.bind(this)
    );

    let lat = JSON.parse(localStorage.getItem('latitude'));
    let lng = JSON.parse(localStorage.getItem('longitude'));
    if (lat != null && lng != null) {
      this.latitude = Number.parseFloat(lat);
      this.longitude = Number.parseFloat(lng);

      this.map.setCenter(
        new google.maps.LatLng(this.latitude, this.longitude)
      );

      const location = new google.maps.LatLng(this.latitude, this.longitude);

      const marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: "Got you!",
      });

      this.locationMarker = marker;

      this.getBuildingSearchingResults();
    }


   // this.setCurrentPosition();
  }

  visitWorkplace(workplaceId) {
    this.router.navigate(["/workplace"]);
    localStorage.setItem('workplaceId', workplaceId);
  }

  boundsListener() {
    this.searchBox.setBounds(this.map.getBounds());
  }

  searchListener() {
    const places = this.searchBox.getPlaces();
    places.map = this.map;

    if (places.length === 0) {
      return;
    }

    // Clear out the old markers.
    this.markers.forEach(function (marker) {
      marker.setMap(null);
    });
    this.markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();
    places.forEach(
      function (place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        console.log(place.geometry);

        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };

        // Create a marker for each place.
        this.markers.push(
          new google.maps.Marker({
            map: this.map,
            title: place.name,
            position: place.geometry.location,
          })
        );

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);


        }

      }.bind(this)
    );
    this.map.fitBounds(bounds);
    for (let i = 0; i < this.gmarkers.length; i++) {
      this.gmarkers[i].setMap(null);
    }
    this.locationMarker.setMap(null);
    console.log(places[0]);
    this.latitude = places[0].geometry.location.lat();
    this.longitude = places[0].geometry.location.lng();
    localStorage.setItem('latitude', this.latitude);
    localStorage.setItem('longitude', this.longitude);


    this.getBuildingSearchingResults();
    console.log(this.markers);
  }

  setMapType(mapTypeId: string) {
    this.map.setMapTypeId(mapTypeId);
  }

  toggleMap() {
    this.isHidden = !this.isHidden;
    this.gmapElement.nativeElement.hidden = this.isHidden;
  }

  /*getFindedWorkplacesList() {
    this.searchingViewModel = JSON.parse(
      localStorage.getItem("searchingViewModel")
    );

    this.apiClient
      .searcForWorcplaces(this.searchingViewModel)
      .subscribe((data: FindedWorkplace[]) => {
        this.findedWorkplacesList = data;
        for (const item of this.findedWorkplacesList) {
          this.apiClient
            .getWorkplaceById(item.workplaceId)
            .subscribe((workplace: Workplace) => {
              this.worlplacesList.Add(workplace);
            });
        }
        console.log(this.findedWorkplacesList);
      });
  }*/

  setCurrentPosition() {
    if ("geolocation" in navigator) {
      this.locationMarker.setMap(null);
      this.locationMarker = null;
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log(this.latitude);

        this.map.setCenter(
          new google.maps.LatLng(this.latitude, this.longitude)
        );
        localStorage.setItem('latitude', this.latitude);
        localStorage.setItem('longitude', this.longitude);
        const location = new google.maps.LatLng(this.latitude, this.longitude);

        const marker = new google.maps.Marker({
          position: location,
          map: this.map,
          title: "Got you!",
        });

        this.locationMarker = marker;

        this.getBuildingSearchingResults();
      });
    }
  }

  getBuildingSearchingResults() {
    this.isRequesting = true;
    this.apiClient
    .getBuildingSearchingResults(this.latitude, this.longitude)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: BuildingSearchingResult[]) => {
      this.buildingSearchingResults = data;
      console.log(data);
      this.showBuildings();
    });
  }

  setCenter(latitude: number, longitude: number) {
    this.locationMarker.setMap(null);
    this.locationMarker = null;
    this.map.setCenter(new google.maps.LatLng(latitude, longitude));

    const location = new google.maps.LatLng(latitude, longitude);

    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: "Got you!",
    });
    this.locationMarker = marker;

  //  marker.addListener("click", this.simpleMarkerHandler);

    marker.addListener("click", () => {
      this.markerHandler(marker);
    });
  }

  markerHandler(marker: google.maps.Marker) {
    alert(
      "Marker's Title: " +
        marker.getTitle() +
        "pos      " +
        marker.getPosition()
    );
  }



  showWorkplace(workplace: Workplace) {
    // this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
    let building: Building;
    console.log("jsndjsnfjsnfs");
    console.log(workplace);
    this.apiClient
      .getBuildingById(workplace.buildingId)
      .subscribe((data: Building) => {
        building = data;

        const location = new google.maps.LatLng(
          building.x / 100000,
          building.y / 100000
        );

        // console.log(`selected marker: ${this.selectedMarkerType}`);

        const marker = new google.maps.Marker({
          position: location,
          map: this.map,
          icon: this.iconBase + this.selectedMarkerType,
          title: building.name,
        });
        this.gmarkers.push(marker); // marker.addListener('click', this.simpleMarkerHandler);

        marker.addListener("click", () => {
        //  this.buildingHendler(building, marker);
        });
      });
  }

  /*buildingHendler(building: Building, marker: google.maps.Marker): void {
    // const restaurantJson = restaurant.toJSON();
    this.selectedBuilding = building;
    this.workplacesByBuilding = this.worlplacesList
      .Where((x) => x.buildingId === building.id)
      .ToArray();
  }*/

  navigateToWorkplace(workpl: Workplace) {
    localStorage.setItem("selectedWorkplace", JSON.stringify(workpl));
    this.router.navigate(["/workplace"]);
  }

  /*showAppropriate() {
    console.log(this.worlplacesList.ElementAt(0));
    for (let i = 0; i < this.worlplacesList.Count(); i++) {
      this.showWorkplace(this.worlplacesList.ElementAt(i));
    }
  }*/

  getFindedWorkplaceById(id: number): FindedWorkplace {
    return this.findedWorkplacesList.find((x) => x.workplaceId === id);
  }

  showBuildings() {
    for (let i = 0; i < this.buildingSearchingResults.length; i++) {

      const location = new google.maps.LatLng(
        this.buildingSearchingResults[i].building.x,
        this.buildingSearchingResults[i].building.y,
      );

      const marker = new google.maps.Marker({
        position: location,
        map: this.map,
        icon: this.iconBase + this.selectedMarkerType,
        title: this.buildingSearchingResults[i].building.name,
      });
      let building = this.buildingSearchingResults[i];
      marker.addListener('click', function() {
          this.isOneBuildingShown = true;
          this.buildingToShow = building;
      }.bind(this));
      this.gmarkers.push(marker); // marker.addListener('click', this.simpleMarkerHandler);

    }
  }

  showAllBuildings() {
    this.isOneBuildingShown = false;
  }
}
