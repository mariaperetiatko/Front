import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Client, DeliveryAddress } from '../api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-address-create',
  templateUrl: './address-create.component.html',
  styleUrls: ['./address-create.component.css']
})
export class AddressCreateComponent implements OnInit {

  address: DeliveryAddress = new DeliveryAddress({
    country: '',
    city: '',
    streete: '',
    houseNamber: undefined,
    flatNamber: undefined,
    xcoordinate: undefined,
    ycoordinate: undefined
  }
  );

  constructor(private client: Client, private router: Router,  private userService: UserService) { }

  ngOnInit() {
  }

  createDeliveryAddress(): void {
    this.client.createDeliveryAddress(this.address)
    .subscribe(result => {
      if (result) {
        this.router.navigate(['/addresses']);
      }
    });
  }

}
