import { Component, OnInit } from '@angular/core';
import { APIClient, Client, WorkplaceOrder, Workplace } from '../api.service';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-clients-admin',
  templateUrl: './clients-admin.component.html',
  styleUrls: ['./clients-admin.component.css']
})
export class ClientsAdminComponent implements OnInit {

  clientsList: Client[] = [];
  client: Client;
  isUpdate = false;
  isCreate = false;
  isUsed = false;
  workplaceOrdersList: WorkplaceOrder[] = [];
  workPlaceList: Workplace[] = [];
  isOrders = false;
  isRequesting=false;

  constructor(private apiClient: APIClient) { }

  ngOnInit() {
    this.getClientsList();
  }

  getClientsList() {
    this.isRequesting = true;
    this.apiClient.getClientsList()
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe((data: Client[]) => this.clientsList = data);
  }

  updateClient(client: Client): void {
    this.client = client;
    this.isCreate = false;
    this.isUpdate = true;
    this.isOrders = false;
    this.isUsed = true;
  }

  onUpdate(client: Client): void {
    this.isRequesting = true;
    this.apiClient.updateClient(client)
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe(result => {
      this.ngOnInit();
      this.isUsed = false;
     });
   }

   createClient(): void {
    this.client = new Client();
    this.isUpdate = false;
    this.isOrders = false;
    this.isUsed = true;
    this.isCreate = true;
  }

  onCreate(client: Client): void {
    this.isRequesting = true;
    this.apiClient.createClient(client)
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe(result => {
      this.ngOnInit();
      this.isUsed = false;
     });
   }

   deleteClient(clientId: number): void {
    this.isRequesting = true;
    this.apiClient.deleteClient(clientId)
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe(result => {
      this.ngOnInit();
      this.hide();
    });
  }

  hide(): void {
    this.isUpdate = false;
    this.isOrders = false;
    this.isUsed = false;
    this.isCreate = false;
  }

  getWorkplaceOrders(clientId: number): void {
    this.isRequesting = true;
    this.apiClient.getWorkplaceOrdersList()
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe((data: WorkplaceOrder[]) => {
      this.workplaceOrdersList = data.filter(x => x.clientId === clientId);
      this.isOrders = true;
    });
  }

  delepeWorkplaceOrder(workplaceOrder: WorkplaceOrder) {
    this.isRequesting = true;
    this.apiClient.deleteWorkplaceOrder(workplaceOrder.id)
    .pipe(finalize(() => (this.isRequesting = false)))
    .subscribe(result => {
      this.getWorkplaceOrders(workplaceOrder.clientId);
    });
  }

}
