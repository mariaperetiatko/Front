import { Input, Component, OnInit } from '@angular/core';
import { Client, FoodStyle, Customer , Product} from '../api.service';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-food-style-products',
  templateUrl: './food-style-products.component.html',
  styleUrls: ['./food-style-products.component.css']
})
export class FoodStyleProductsComponent implements OnInit {

  @Input() foodStyleId: number;
  isRequesting: boolean;
  products: Product[];
  constructor(private client: Client, private router: Router,  private userService: UserService) { }

  ngOnInit() {
    this.productByFoodStyle(this.foodStyleId);
  }

  productByFoodStyle(foodStyleId: number): void {
    this.isRequesting = true;
    this.client.productByFoodStyle(foodStyleId)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: Product[]) => this.products = data);
alert(this.products);
  }

}
