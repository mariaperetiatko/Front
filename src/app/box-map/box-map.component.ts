import { Observable } from 'rxjs';
/// <reference types="@types/googlemaps" />
import { Component, AfterContentInit } from '@angular/core';
import { Restaurant, Client, Customer } from '../api.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ViewChild } from '@angular/core';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';


@Component({
  selector: 'app-box-map',
  templateUrl: './box-map.component.html',
  styleUrls: ['./box-map.component.css']
})
export class BoxMapComponent implements AfterContentInit {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

  markerTypes = [
    {
      text: 'Restaurant', value: 'placemark_circle_highlight.png'
    }
    // ,
    // {
    //   text: "Library", value: "library_maps.png"
    // },
    // {
    //   text: "Information", value: "info-i_maps.png"
    // }
  ];

  selectedMarkerType = 'placemark_circle_highlight.png';
  latitude: any;
  longitude: any;

  gmarkers: google.maps.Marker[] = [];

  constructor(private client: Client, private router: Router,  private userService: UserService) { }

  ngAfterContentInit() {
    const mapProp = {
      center: new google.maps.LatLng(18.5793, 73.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.initializeMarkers();
    // alert(this.gmarkers[1].getTitle().toString());
  }

  initializeMarkers(): void {

    const marker1 = new google.maps.Marker({
      position: new google.maps.LatLng(20, 20),
      map: this.map,
      icon: this.iconBase + this.selectedMarkerType,
      title: 'Got you!',
      visible: false
    });

    const marker2 = new google.maps.Marker({
      position: new google.maps.LatLng(21, 21),
      map: this.map,
      icon: this.iconBase + this.selectedMarkerType,
      title: 'Got you!',
      visible: false
    });

    const marker3 = new google.maps.Marker({
      position: new google.maps.LatLng(22, 22),
      map: this.map,
      icon: this.iconBase + this.selectedMarkerType,
      title: 'Got you!',
      visible: false
    });

    this.gmarkers.push(marker1);
    this.gmarkers.push(marker2);
    this.gmarkers.push(marker3);

  }

  showDot(markerNumber: number): void {
    this.gmarkers[markerNumber].setVisible(true);
  }

  hideDot(markerNumber: number): void {
    this.gmarkers[markerNumber].setVisible(false);
  }

  showMoving(): void {
    let counter = 0;
    interval(1000)
    .pipe(takeWhile(() => (counter < 3)))
    .subscribe(i => {

      this.showDot(counter++);
    });
  }

}
