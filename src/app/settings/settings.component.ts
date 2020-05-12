import { Component, OnInit } from '@angular/core';
import { APIClient, Client } from '../api.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  client: Client;
  isRequesting: boolean;
  isHeightVisible = false;
  isVisionVisible = false;
  isTableHeightVisible = false;
  isChairHeightVisible = false;
  isLightVisible = false;
  isTemperatureVisible = false;
  isMusicVisible = false;
  isDrinkVisible = false;
  recommendedTableHeight = 0;
  isRecommendedTableVisible = false;
  recommendedChairHeight = 0;
  isRecommendedChairVisible = false;
  isRequestingRecommendations = false;

  constructor(private apiClient: APIClient, private router: Router,  private userService: UserService) {
  }

  ngOnInit() {
    this.getClient();
  }

  getRecommendedParams() {
    if (this.client.hight > 0) {
      this.isRequestingRecommendations = true;
      this.getRecommendedChairHeight();
      this.getRecommendedTableHeight();
    }
  }

  getClient(): void {
    this.isRequesting = true;

    this.apiClient.getClientById(1)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: Client) => {
     this.client = data;
    });
  }

  showHideHeightInput(): void {
    if (!this.isHeightVisible) {
      this.isHeightVisible = true;
    } else {
      this.isHeightVisible = false;
    }
  }

  showHideVisionInput(): void {
    if (!this.isVisionVisible) {
      this.isVisionVisible = true;
    } else {
      this.isVisionVisible = false;
    }
  }

  showHideTableHeightInput(): void {
    if (!this.isTableHeightVisible) {
      this.isTableHeightVisible = true;
    } else {
      this.isTableHeightVisible = false;
    }
  }


  showHideChairHeightInput(): void {
    if (!this.isChairHeightVisible) {
      this.isChairHeightVisible = true;
      this.isChairHeightVisible = true;
    } else {
      this.isChairHeightVisible = false;
    }
  }

  showHideLightInput(): void {
    if (!this.isLightVisible) {
      this.isLightVisible = true;
    } else {
      this.isLightVisible = false;
    }
  }

  showHideTemperatureInput(): void {
    if (!this.isTemperatureVisible) {
      this.isTemperatureVisible = true;
    } else {
      this.isTemperatureVisible = false;
    }
  }

  showHideMusicInput(): void {
    if (!this.isMusicVisible) {
      this.isMusicVisible = true;
    } else {
      this.isMusicVisible = false;
    }
  }

  showHideDrinkInput(): void {
    if (!this.isDrinkVisible) {
      this.isDrinkVisible = true;
    } else {
      this.isDrinkVisible = false;
    }
  }

  getRecommendedTableHeight() {
    this.apiClient.calculateRecommendedTableHeight(this.client.hight)
    .subscribe((data: number) => {
      this.recommendedTableHeight = parseFloat(data.toFixed());
      this.isRecommendedTableVisible = true;
      this.isRequestingRecommendations = false;
    });
  }

  applyRecommendedTable() {
    this.client.tableHight = this.recommendedTableHeight;
    this.isRecommendedTableVisible = false;
  }

  getRecommendedChairHeight() {
    this.apiClient.calculateRecommendedChairHeight(this.client.hight)
    .subscribe((data: number) => {
      this.recommendedChairHeight = parseFloat(data.toFixed());
      this.isRecommendedChairVisible = true;
      this.isRequestingRecommendations = false;
    });
  }

  applyRecommendedChair() {
    this.client.chairHight = this.recommendedChairHeight;
    this.isRecommendedChairVisible = false;
  }

  updateClient(client: Client): void {
    this.isRequesting = true;
    this.isHeightVisible = false;
    this.isVisionVisible = false;
    this.isTableHeightVisible = false;
    this.isChairHeightVisible = false;
    this.isLightVisible = false;
    this.isTemperatureVisible = false;
    this.isMusicVisible = false;
    this.isDrinkVisible = false;

    this.apiClient.updateClient(client)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((result: Client) => {this.client = result; });
  }
}
