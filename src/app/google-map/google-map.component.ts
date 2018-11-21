/// <reference types="@types/googlemaps" />

import { Component, OnInit, AfterContentInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Restaurant, Client, Customer } from '../api.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements AfterContentInit {

  restaurants: Restaurant[];
  customer: Customer;
  appropriateRestaurants: Restaurant[];
  favouriteRestaurants: Restaurant[];
  radius: number;
  gmarkers = [];

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  latitude: any;
  longitude: any;

  iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

  markerTypes = [
    {
      text: 'Restaurant', value: 'dining.png'
    }
    // ,
    // {
    //   text: "Library", value: "library_maps.png"
    // },
    // {
    //   text: "Information", value: "info-i_maps.png"
    // }
  ];

  selectedMarkerType = 'dining.png';

  isHidden = false;

  constructor(private client: Client, private router: Router,  private userService: UserService) { }

  ngAfterContentInit() {

    this.getCustomer();
    const mapProp = {
      center: new google.maps.LatLng(18.5793, 73.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    this.getListOfRestaurants();
    // this.showAllRestaurants();

  }

  getCustomer(): void {
    this.client.getCustomer()
    .subscribe((data: Customer) => this.customer = data);
  }

  setMapType(mapTypeId: string) {
    this.map.setMapTypeId(mapTypeId);
  }

  getListOfRestaurants(): void {
    this.client.getListOfRestaurants()
    .subscribe((data: Restaurant[]) => this.restaurants = data);
  }

  setCenter() {
    this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));

    const location = new google.maps.LatLng(this.latitude, this.longitude);

    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: 'Got you!'
    });

    marker.addListener('click', this.simpleMarkerHandler);

    marker.addListener('click', () => {
      this.markerHandler(marker);
    });
  }

  simpleMarkerHandler() {

    alert('Simple Component\'s function...');
  }

  markerHandler(marker: google.maps.Marker) {
    alert('Marker\'s Title: ' + marker.getTitle() + 'pos      ' + marker.getPosition());
  }

  showCustomMarker() {


    this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));

    const location = new google.maps.LatLng(this.latitude, this.longitude);

    console.log(`selected marker: ${this.selectedMarkerType}`);

    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: this.iconBase + this.selectedMarkerType,
      title: 'Got you!'
    });
    marker.addListener('click', this.simpleMarkerHandler);

    marker.addListener('click', () => {
      this.markerHandler(marker);
    });
  }

  showAllRestaurants(): void {
    alert(this.restaurants.length);
    for (let i = 0; i < this.restaurants.length; i++) {
      this.showRestaurant(this.restaurants[i]);
    }
  }

  showRestaurant(restaurant: Restaurant) {

   // this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
   alert(restaurant.xcoordinate + '   ' + restaurant.ycoordinate);


    const location = new google.maps.LatLng(restaurant.xcoordinate, restaurant.ycoordinate);

    // console.log(`selected marker: ${this.selectedMarkerType}`);

    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: this.iconBase + this.selectedMarkerType,
      title: restaurant.restaurantName
    });
    this.gmarkers.push(marker);
    // marker.addListener('click', this.simpleMarkerHandler);

    marker.addListener('click', () => {
      this.restaurantHendler(restaurant, marker);
    });
  }

  restaurantHendler(restaurant: Restaurant, marker: google.maps.Marker ): void {
    alert('Marker\'s Title: ' + marker.getTitle() + 'pos      ' + marker.getPosition());
    // const restaurantJson = restaurant.toJSON();
    localStorage.setItem('restaurant', JSON.stringify(restaurant));
   alert(restaurant);
   this.router.navigate(['/restaurantPage']);
  }


  toggleMap() {
    this.isHidden = !this.isHidden;

    this.gmapElement.nativeElement.hidden = this.isHidden;
  }

  setCurrentPosition() {
    if ('geolocation' in navigator) {
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

      const location1 = new google.maps.LatLng(this.latitude - 1, this.longitude + 1);

      const marker1 = new google.maps.Marker({
        position: location1,
        map: this.map,
        title: 'Got you!'
      });

    }
  }

  showAppropriate(customerId: number, radius: number, addressId: number) {
    this.removeMarkers();
    this.client.findRestaurantsByAppropriate(customerId, radius, addressId)
    .subscribe((data: Restaurant[]) => {
      this.appropriateRestaurants = data;
      for (let i = 0; i < this.appropriateRestaurants.length; i++) {
        this.showRestaurant(this.appropriateRestaurants[i]);
      }
    }
    );
  }

  showFavourite(customerId: number, radius: number, addressId: number) {
    this.removeMarkers();
    this.client.findRestaurantsByFavourite(customerId, radius, addressId)
    .subscribe((data: Restaurant[]) => {
      this.favouriteRestaurants = data;
      for (let i = 0; i < this.favouriteRestaurants.length; i++) {
        this.showRestaurant(this.favouriteRestaurants[i]);
      }
    }
    );
  }

  removeMarkers() {
    this.gmarkers.forEach((marker) => {
        marker.setMap(null);
        marker = null;
    });
   this.gmarkers = [];
}

}
