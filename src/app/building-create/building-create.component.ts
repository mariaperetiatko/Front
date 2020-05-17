/// <reference types="@types/googlemaps" />
import {
  Building,
  APIClient,
  BuildingSearchingResult
} from "./../api.service";
import { Component, OnInit, AfterContentInit } from "@angular/core";
import { ViewChild } from "@angular/core";
import { UserService } from "../user.service";
import { Router } from "@angular/router";
import { List } from "linqts";
import { finalize } from "rxjs/operators";

@Component({
  selector: 'app-building-create',
  templateUrl: './building-create.component.html',
  styleUrls: ['./building-create.component.css']
})
export class BuildingCreateComponent implements AfterContentInit {

  building: Building;
  locationMarker: google.maps.Marker = new google.maps.Marker();
  gmarkers = [];

  buildingSearchingResults: BuildingSearchingResult[];
  isRequesting = false;

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

  constructor(
    private apiClient: APIClient,
    private router: Router,
    private userService: UserService
  ) { }

  vm = this;

  ngAfterContentInit() {
    //this.getFindedWorkplacesList();
    this.building = new Building();
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
        draggable: true,
        animation: google.maps.Animation.DROP,
      });

      this.locationMarker = marker;

      google.maps.event.addListener(marker, 'dragend', function () {
        let pos = marker.getPosition();
        console.log('this');

        let geocoder = new google.maps.Geocoder();

        geocoder.geocode
          ({
            location: pos
          },

            function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                for (var i = 0; i < results[0].address_components.length; i++) {
                  if (results[0].address_components[i].types[0] === "country") {
                    this.building.country = results[0].address_components[i].long_name;
                  }

                  if (results[0].address_components[i].types[0] === "locality") {
                    this.building.city = results[0].address_components[i].long_name;
                  }

                  if (results[0].address_components[i].types[0] === "route") {
                    this.building.street = results[0].address_components[i].long_name;
                  }

                  if (results[0].address_components[i].types[0] === "street_number") {
                    this.building.house = results[0].address_components[i].long_name;
                  }

                }
                this.building.x = results[0].geometry.location.lat();
                this.building.y = results[0].geometry.location.lng();
                console.log(this.building);
                // $("#mapErrorMsg").hide(100);
              }
              else {
                console.log('error');
                //  $("#mapErrorMsg").html('Cannot determine address at this location.'+status).show(100);
              }
            }.bind(this)
          );
      }.bind(this)
      );
    }


    function geocodePosition(pos) {
      console.log('this');

      let geocoder = new google.maps.Geocoder();
      console.log(this);
      geocoder.geocode
        ({
          location: pos
        },
          function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              for (var i = 0; i < results[0].address_components.length; i++) {
                if (results[0].address_components[i].types[0] === "country") {
                  this.building.country = results[0].address_components[i].long_name;
                }

                if (results[0].address_components[i].types[0] === "locality") {
                  this.building.city = results[0].address_components[i].long_name;
                }

                if (results[0].address_components[i].types[0] === "route") {
                  this.building.street = results[0].address_components[i].long_name;
                }

                if (results[0].address_components[i].types[0] === "street_number") {
                  this.building.house = results[0].address_components[i].long_name;
                }

              }
              console.log(results[0].geometry.location.lat());
              // $("#mapErrorMsg").hide(100);
            }
            else {
              console.log('error');
              //  $("#mapErrorMsg").html('Cannot determine address at this location.'+status).show(100);
            }
          }.bind(this)
        );
    }

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
            draggable: true,
            animation: google.maps.Animation.DROP,
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

    this.latitude = places[0].geometry.location.lat();
    this.longitude = places[0].geometry.location.lng();
    localStorage.setItem('latitude', this.latitude);
    localStorage.setItem('longitude', this.longitude);

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
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: location,
          map: this.map,
          title: "Got you!",
        });

        this.locationMarker = marker;

      });
    }
  }



  /*buildingHendler(building: Building, marker: google.maps.Marker): void {
    // const restaurantJson = restaurant.toJSON();
    this.selectedBuilding = building;
    this.workplacesByBuilding = this.worlplacesList
      .Where((x) => x.buildingId === building.id)
      .ToArray();
  }*/


  /*showAppropriate() {
    console.log(this.worlplacesList.ElementAt(0));
    for (let i = 0; i < this.worlplacesList.Count(); i++) {
      this.showWorkplace(this.worlplacesList.ElementAt(i));
    }
  }*/



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
      marker.addListener('click', function () {
        this.isOneBuildingShown = true;
        this.buildingToShow = building;
      }.bind(this));
      this.gmarkers.push(marker); // marker.addListener('click', this.simpleMarkerHandler);

    }
  }

}

