import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Client, DeliveryAddress } from '../api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-address-update',
  templateUrl: './address-update.component.html',
  styleUrls: ['./address-update.component.css']
})
export class AddressUpdateComponent implements OnInit {

  address: DeliveryAddress;
  isRequesting: boolean;
  constructor(private client: Client, private router: Router,  private userService: UserService) { }

  ngOnInit() {
    this.getDeliveryAddress();
  }

  getDeliveryAddress(): void {
    const address: DeliveryAddress = JSON.parse(localStorage.getItem('address'));
    this.address = address;
  }

  updateDeliveryAddress(): void {
    this.client.updateDeliveryAddress(this.address)
    .subscribe(result => {
      if (result) {
        this.router.navigate(['/addresses']);
      }
    });
  }

}
