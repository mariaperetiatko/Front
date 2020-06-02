import { Component, OnInit } from '@angular/core';
import { APIClient, WorkplaceOrder, Equipment } from '../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-landlord-equipment',
  templateUrl: './landlord-equipment.component.html',
  styleUrls: ['./landlord-equipment.component.css']
})
export class LandlordEquipmentComponent implements OnInit {

  isRequesting = false;
  equipments: Equipment[];
  newEquipment: Equipment = new Equipment();
  isNameValid = false;

  constructor(
    private apiClient: APIClient,
    private router: Router,
    private userService: UserService, private activateRoute: ActivatedRoute
  ) { }

  checkValue() {
    if(this.equipments.filter(e => e.name === this.newEquipment.name).length > 0|| this.newEquipment.name=='')
    this.isNameValid = false;
    else
    this.isNameValid = true;

  }

  ngOnInit() {
    this.getEquipments();
  }

  getEquipments() {
    this.isRequesting = true;

    this.apiClient
      .getEquipmentsList()
      .pipe(finalize(() => this.isRequesting = false))
      .subscribe((data: Equipment[]) => {
        this.equipments = data;
      });
  }

  createEquipment() {
    this.isRequesting = true;

    this.apiClient
      .createEquipment(this.newEquipment)
      .subscribe((data) => {
        this.newEquipment = new Equipment();
        this.getEquipments();
      });
  }

}
