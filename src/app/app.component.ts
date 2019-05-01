import { Component, OnInit } from '@angular/core';
import { Client, APIClient } from './api.service';
import { UserService } from './user.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'EasyEat';

  clients: Client[] = [];

  constructor(private apiClient: APIClient, private userService: UserService) { }

  ngOnInit() {
    // this.get66();
  }


  logout() {
    this.userService.logout();
    window.location.reload();
 }
}
