import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Building, APIClient } from '../api.service';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-landlord-buildings',
  templateUrl: './landlord-buildings.component.html',
  styleUrls: ['./landlord-buildings.component.css']
})
export class LandlordBuildingsComponent implements OnInit {

  buildings: Building[];
  isRequesting = false;

  constructor(private apiClient: APIClient, private router: Router,  private userService: UserService) { }

  ngOnInit() {
    this.getBuildingsByLandlord();
  }

  goToCreatePage() {
    this.router.navigate(["/building-create/"]);
  }

  getWorkingHours(building: Building): string {
    let startWorkingTime;
    if (building.startMinute === 0) {
     startWorkingTime = building.startHour + ":00";
    } else {
      startWorkingTime = building.startHour + ":30";
    }
    let finishWorkingTime;
    if (building.finishMinute === 0) {
      finishWorkingTime = building.finistHour + ":00";
    } else {
      finishWorkingTime = building.finistHour + ":30";
    }

    return startWorkingTime + ' - ' + finishWorkingTime;
  }

  getBuildingsByLandlord(): void {
    this.isRequesting = true;

    this.apiClient.getBuildingsByLandlord()
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: Building[]) => this.buildings = data);
  }
}
