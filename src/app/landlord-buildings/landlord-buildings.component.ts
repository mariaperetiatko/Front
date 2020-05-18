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
    //this.getBuildingsByLandlord();
  }

  goToCreatePage() {
    this.router.navigate(["/building-create/"]);
  }


}
