import { Component, OnInit } from '@angular/core';
import { Client, Customer } from '../api.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-customer-account',
  templateUrl: './customer-account.component.html',
  styleUrls: ['./customer-account.component.css']
})
export class CustomerAccountComponent implements OnInit {

  customer: Customer;

  constructor(private client: Client, private userService: UserService) { }

  ngOnInit() {
    this.getCustomer();
  }

  getCustomer(): void {
    this.client.getCustomer().
    subscribe((data: Customer) => this.customer = data);
  }
}
