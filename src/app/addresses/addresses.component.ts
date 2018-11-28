import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Client, DeliveryAddress } from '../api.service';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit {

  deliveryAddresses: DeliveryAddress[];
  addressForUpdate: DeliveryAddress;

  constructor(private client: Client, private router: Router,  private userService: UserService) { }

  ngOnInit() {
    this.getListOfAddresses();
  }

  getListOfAddresses(): void {
    this.client.getListOfDeliveryAddresses()
    .subscribe((data: DeliveryAddress[]) => {
      this.deliveryAddresses = data;
    });
  }

  deleteDeleveryAddress(addressId: number): void {
    this.client.deleteDeliveryAddress(addressId)
    .subscribe(
      result => {
        if (result) {
          window.location.reload();
        }
      });
  }

  updateDeleveryAddress(address: DeliveryAddress): void {
    localStorage.setItem('address', JSON.stringify(address));
    this.router.navigate(['/addressUpdate']);
  }

  createDeliveryAddress(): void {
    this.router.navigate(['/addressCreate']);
  }

}
