/// <reference types="@types/googlemaps" />
import {
  Building,
  APIClient,
  BuildingSearchingResult
} from "./../api.service";
import { Component, OnInit, AfterContentInit, TemplateRef } from "@angular/core";
import { ViewChild } from "@angular/core";
import { UserService } from "../user.service";
import { Router, ActivatedRoute } from "@angular/router";
import { List } from "linqts";
import { finalize } from "rxjs/operators";

import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-building-edit',
  templateUrl: './building-edit.component.html',
  styleUrls: ['./building-edit.component.css']
})
export class BuildingEditComponent implements AfterContentInit {

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
  mondayStart;
  mondayFinish;
  tuesdayStart;
  tuesdayFinish;
  wednesdayStart;
  wednesdayFinish;
  thursdayStart;
  thursdayFinish;
  saturdayStart;
  saturdayFinish;
  sundayStart;
  sundayFinish;
  isMonStartChecked = true;
  isMonTimeDisable = false;
  isTueStartChecked = true;
  isTueTimeDisable = false;
  isWedStartChecked = true;
  isWedTimeDisable = false;
  isThuStartChecked = true;
  isThuTimeDisable = false;
  isFriStartChecked = true;
  isFriTimeDisable = false;
  isSatStartChecked = true;
  isSatTimeDisable = false;
  isSunStartChecked = true;
  isSunTimeDisable = false;
  address = "";
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

  timeObjects = [
    { numeric: 0, str: '00:00' }, { numeric: 0.5, str: '00:30' }, { numeric: 1, str: '01:00' }, { numeric: 1.5, str: '01:30' },
    { numeric: 2, str: '02:00' }, { numeric: 2.5, str: '02:30' }, { numeric: 3, str: '03:00' }, { numeric: 3.5, str: '03:30' },
    { numeric: 4, str: '04:00' }, { numeric: 4.5, str: '04:30' }, { numeric: 5, str: '05:00' }, { numeric: 5.5, str: '05:30' },
    { numeric: 6, str: '06:00' }, { numeric: 6.5, str: '06:30' }, { numeric: 7, str: '07:00' }, { numeric: 7.5, str: '07:30' },
    { numeric: 8, str: '08:00' }, { numeric: 8.5, str: '08:30' }, { numeric: 9, str: '09:00' }, { numeric: 9.5, str: '09:30' },
    { numeric: 10, str: '10:00' }, { numeric: 10.5, str: '10:30' }, { numeric: 11, str: '11:00' }, { numeric: 11.5, str: '11:30' },
    { numeric: 12, str: '12:00' }, { numeric: 12.5, str: '12:30' }, { numeric: 13, str: '13:00' }, { numeric: 13.5, str: '13:30' },
    { numeric: 14, str: '14:00' }, { numeric: 14.5, str: '14:30' }, { numeric: 15, str: '15:00' }, { numeric: 15.5, str: '15:30' },
    { numeric: 16, str: '16:00' }, { numeric: 16.5, str: '16:30' }, { numeric: 17, str: '17:00' }, { numeric: 17.5, str: '17:30' },
    { numeric: 18, str: '18:00' }, { numeric: 18.5, str: '18:30' }, { numeric: 19, str: '19:00' }, { numeric: 19.5, str: '19:30' },
    { numeric: 20, str: '20:00' }, { numeric: 20.5, str: '20:30' }, { numeric: 21, str: '21:00' }, { numeric: 21.5, str: '21:30' },
    { numeric: 22, str: '22:00' }, { numeric: 22.5, str: '22:30' }, { numeric: 23, str: '23:00' }, { numeric: 23.5, str: '23:30' },
    { numeric: 24, str: '24:00' }
  ];

  buildingId;
  @ViewChild("content") templateRef: TemplateRef<any>;

  constructor(
    private apiClient: APIClient,
    private router: Router,
    private userService: UserService, private modalService: NgbModal, private activateRoute: ActivatedRoute
  ) { }


  ngAfterContentInit(): void {
    this.buildingId = Number.parseFloat(this.activateRoute.snapshot.params['buildingId']);
    if (this.buildingId >= 0) {
      this.getBuilding();
    }
  }

  getBuilding() {
    this.isRequesting = true;
    this.apiClient.getBuildingById(this.buildingId)
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe((data: Building) => {
        this.building = data;
        console.log(data);
        this.ngAfterContentInit1();

      });
  }

  updateBuilding() {
    if (!this.isMonTimeDisable) {
      if (this.building.monStartTime == null) {
        this.building.monStartTime = 0;
      }
      if (this.building.monFinishTime == null) {
        this.building.monFinishTime = 24;
      }
    }

    if (!this.isTueTimeDisable) {
      if (this.building.tueStartTime == null) {
        this.building.tueStartTime = 0;
      }
      if (this.building.tueFinishTime == null) {
        this.building.tueFinishTime = 24;
      }
    }

    if (!this.isWedTimeDisable) {
      if (this.building.wedStartTime == null) {
        this.building.wedStartTime = 0;
      }
      if (this.building.wedFinishTime == null) {
        this.building.wedFinishTime = 24;
      }
    }

    if (!this.isThuTimeDisable) {
      if (this.building.thuStartTime == null) {
        this.building.thuStartTime = 0;
      }
      if (this.building.thuFinishTime == null) {
        this.building.thuFinishTime = 24;
      }
    }

    if (!this.isFriTimeDisable) {
      if (this.building.friStartTime == null) {
        this.building.friStartTime = 0;
      }
      if (this.building.friFinishTime == null) {
        this.building.friFinishTime = 24;
      }
    }

    if (!this.isSatTimeDisable) {
      if (this.building.satStartTime == null) {
        this.building.satStartTime = 0;
      }
      if (this.building.satFinishTime == null) {
        this.building.satFinishTime = 24;
      }
    }

    if (!this.isSunTimeDisable) {
      if (this.building.sunStartTime == null) {
        this.building.sunStartTime = 0;
      }
      if (this.building.sunFinishTime == null) {
        this.building.sunFinishTime = 24;
      }
    }
    if (this.building.city === undefined) this.building.city = '';
    if (this.building.country === undefined) this.building.country = '';
    if (this.building.street === undefined) this.building.street = '';
    if (this.building.house === undefined) this.building.house = '';
    //if (this.building.flat === undefined) this.building.flat = 1;

    this.isRequesting = true;

    this.apiClient.updateBuilding(this.building)
      .pipe(finalize(() => (this.isRequesting = false)))
      .subscribe((data: Building) => {
        const element: HTMLElement = document.getElementById(
          "myDiv"
        ) as HTMLElement;
        element.click();

      });

  }

  monTimeDisable() {
    if (this.isMonTimeDisable) {
      this.isMonTimeDisable = false;
    } else {
      this.isMonTimeDisable = true;
      this.building.monStartTime = null;
      this.building.monFinishTime = null;
    }
  }

  tueTimeDisable() {
    if (this.isTueTimeDisable) {
      this.isTueTimeDisable = false;
    } else {
      this.isTueTimeDisable = true;
      this.building.tueStartTime = null;
      this.building.tueFinishTime = null;
    }
  }

  wedTimeDisable() {
    if (this.isWedTimeDisable) {
      this.isWedTimeDisable = false;
    } else {
      this.isWedTimeDisable = true;
      this.building.wedStartTime = null;
      this.building.wedFinishTime = null;
    }
  }

  thuTimeDisable() {
    if (this.isThuTimeDisable) {
      this.isThuTimeDisable = false;
    } else {
      this.isThuTimeDisable = true;
      this.building.thuStartTime = null;
      this.building.thuFinishTime = null;
    }
  }

  friTimeDisable() {
    if (this.isFriTimeDisable) {
      this.isFriTimeDisable = false;
    } else {
      this.isFriTimeDisable = true;
      this.building.friStartTime = null;
      this.building.friFinishTime = null;
    }
  }

  satTimeDisable() {
    if (this.isSatTimeDisable) {
      this.isSatTimeDisable = false;
    } else {
      this.isSatTimeDisable = true;
      this.building.satStartTime = null;
      this.building.satFinishTime = null;
    }
  }

  sunTimeDisable() {
    if (this.isSunTimeDisable) {
      this.isSunTimeDisable = false;
    } else {
      this.isSunTimeDisable = true;
      this.building.sunStartTime = null;
      this.building.sunFinishTime = null;
    }
  }
  inputs;
  ngAfterContentInit1() {

    const mapProp = {
      center: new google.maps.LatLng(50.01509, 36.22864),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    this.markers = [];
    this.inputs = document.getElementById("address") as HTMLInputElement;
    this.searchBox = new google.maps.places.SearchBox(this.inputs);

    this.map.addListener("bounds_changed", this.boundsListener.bind(this));

    this.searchBox.addListener(
      "places_changed",
      this.searchListener.bind(this)
    );


    this.latitude = this.building.x;
    this.longitude = this.building.y;

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

    let posit = marker.getPosition();

    let geocoder1 = new google.maps.Geocoder();

    geocoder1.geocode
      ({
        location: posit
      },

        function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            this.inputs.value = results[0].formatted_address;
          }
        }.bind(this)
      );


    this.locationMarker = marker;

    google.maps.event.addListener(marker, 'dragend', function () {
      let pos = marker.getPosition();

      let geocoder = new google.maps.Geocoder();

      geocoder.geocode
        ({
          location: pos
        },

          function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              this.inputs.value = results[0].formatted_address;

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

  goToBuildings() {
    this.router.navigate(["/landlord-buildings"]);
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

        const marker = new google.maps.Marker({
          map: this.map,
          title: place.name,
          position: place.geometry.location,
          draggable: true,
          animation: google.maps.Animation.DROP,
        })
        this.markers.push(marker);

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
                  this.inputs.value = results[0].formatted_address;

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
                }
                else {
                  console.log('error');
                  //  $("#mapErrorMsg").html('Cannot determine address at this location.'+status).show(100);
                }
              }.bind(this)
            );
        }.bind(this)
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
  }

  setMapType(mapTypeId: string) {
    this.map.setMapTypeId(mapTypeId);
  }

  toggleMap() {
    this.isHidden = !this.isHidden;
    this.gmapElement.nativeElement.hidden = this.isHidden;
  }

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


        let posit = marker.getPosition();

        let geocoder1 = new google.maps.Geocoder();

        geocoder1.geocode
          ({
            location: posit
          },

            function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                this.inputs.value = results[0].formatted_address;
              }
            }.bind(this)
          );
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
                  this.inputs.value = results[0].formatted_address;

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
                }
                else {
                  console.log('error');
                  //  $("#mapErrorMsg").html('Cannot determine address at this location.'+status).show(100);
                }
              }.bind(this)
            );
        }.bind(this)
        );
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
      this.markers.forEach(function (marker) {
        marker.setMap(null);
      });
      let building = this.buildingSearchingResults[i];
      marker.addListener('click', function () {
        this.isOneBuildingShown = true;
        this.buildingToShow = building;
      }.bind(this));
      this.gmarkers.push(marker); // marker.addListener('click', this.simpleMarkerHandler);

    }
  }

  open() {
    console.log(this.templateRef);
    this.modalService.open(this.templateRef, {
      ariaLabelledBy: "modal-basic-title",
    });
  }

}


