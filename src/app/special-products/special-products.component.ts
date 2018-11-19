import { Component, OnInit } from '@angular/core';
import { Client, SpecialProduct, Product } from '../api.service';
import { UserService } from '../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-special-products',
  templateUrl: './special-products.component.html',
  styleUrls: ['./special-products.component.css']
})
export class SpecialProductsComponent implements OnInit {

  products: Product[];
  specialProducts: SpecialProduct[];
  allowedProducts: Product[] = [];
  notAllowedProducts: Product[] = [];
  specialProductToChange: SpecialProduct = new SpecialProduct();
  isRequesting: boolean;
  selectedAllowed: number;
  selectedNotAllowed: number;
  error: string;
  product: Product;

  constructor(private client: Client, private router: Router,  private userService: UserService) { }

  ngOnInit() {
    this.allowedProductBySpecial();
    this.notAllowedProductBySpecial();
    this.notSpecialProducts();
    this.client.getCustomerByToken()
    .subscribe((data: number) => this.specialProductToChange.customerId = data);
  }

  allowedProductBySpecial(): void {
    this.isRequesting = true;

    this.client.allowedProductBySpecial()
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: Product[]) => this.allowedProducts = data)
    ;
  }

  notAllowedProductBySpecial(): void {
    this.isRequesting = true;

    this.client.notAllowedProductBySpecial()
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: Product[]) => this.notAllowedProducts = data);
  }

  setNotAllowed(prodId: number): void {
    this.specialProductToChange.productId = prodId;
    this.specialProductToChange.allowance = 0;

    this.isRequesting = true;

    this.client.change(this.specialProductToChange)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe(
      result => {
        if (result) {
          window.location.reload();
        }
      }
  );
  }

  setAllowed(prodId: number): void {
    this.specialProductToChange.productId = prodId;
    this.specialProductToChange.allowance = 1;

    this.isRequesting = true;

    this.client.change(this.specialProductToChange)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe(
      result => {
        if (result) {
          window.location.reload();
        }
      }
  );
  }

  notSpecialProducts(): void {
    this.client.notSpecialProducts()
    .subscribe((data: Product[]) => this.products = data);
  }

  createAllowed(prodId: number): void {
    this.isRequesting = true;

    this.specialProductToChange.productId = prodId;
    this.specialProductToChange.allowance = 1;

    this.client.createAllowed(this.specialProductToChange)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe(
      result => {
        if (result) {
          window.location.reload();
        }
      }
  );
  }

  createNotAllowed(prodId: number): void {
    this.isRequesting = true;

    this.specialProductToChange.productId = prodId;
    this.specialProductToChange.allowance = 0;

    this.client.createNotAllowed(this.specialProductToChange)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe(
      result => {
        if (result) {
          window.location.reload();
        }
      },
      error => this.error = error);
  }


  delete(prodId: number): void {
    this.isRequesting = true;

    this.client.deleteSpecialProduct(prodId, this.specialProductToChange.customerId, '')
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe(
      result => {
        if (result) {
          window.location.reload();
        }
      }
  );
  }
}
