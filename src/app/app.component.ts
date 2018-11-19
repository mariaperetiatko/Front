import { Component, OnInit } from '@angular/core';
import { Client, Customer } from './api.service';
import { UserService } from './user.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'EasyEat';

  customers: Customer[] = [];

  constructor(private client: Client, private userService: UserService) { }

  ngOnInit() {
    // this.get66();
  }

  get66(): void {
    this.client.get6().
    subscribe((data: Customer[]) => this.customers = data);
  }

  logout() {
    this.userService.logout();
   // this.get66();
    window.location.reload();
 }
}
