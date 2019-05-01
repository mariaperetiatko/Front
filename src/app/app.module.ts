import { ConfigService } from './config.service';
import { UserService } from './user.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { APIClient } from './api.service';
import { LoginFormComponent } from './login-form/login-form.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//import { GoogleMapComponent } from './google-map/google-map.component';
import { UiModule } from './ui/ui.module';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { CustomerAccountComponent } from './customer-account/customer-account.component';
/*import { SpecialProductsComponent } from './special-products/special-products.component';
import { FoodStyleComponent } from './food-style/food-style.component';
import { IngredientComponent } from './ingredient/ingredient.component';
import { FoodStyleProductsComponent } from './food-style-products/food-style-products.component';
import { FavouriteDishesComponent } from './favourite-dishes/favourite-dishes.component';
import { RestaurantPageComponent } from './restaurant-page/restaurant-page.component';
import { CartComponent } from './cart/cart.component';
import { FoodOrderComponent } from './food-order/food-order.component';*/
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
//import { FoodOrderArchivComponent } from './food-order-archiv/food-order-archiv.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SettingsComponent } from './settings/settings.component';
import { WorkspaceParametersComponent } from './workspace-parameters/workspace-parameters.component';
import { RatingComponent } from './rating/rating.component';
import { MapSearchComponent } from './map-search/map-search.component';
import { WorkplaceComponent } from './workplace/workplace.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import {EventService} from './event.service';
/*import { BoxMapComponent } from './box-map/box-map.component';
import { AddressesComponent } from './addresses/addresses.component';
import { AddressUpdateComponent } from './address-update/address-update.component';
import { AddressCreateComponent } from './address-create/address-create.component';
import { AccountControllerComponent } from './account-controller/account-controller.component';
import { CartControllerComponent } from './admin/cart-controller/cart-controller.component';
import { CreateCartComponent } from './admin/create-cart/create-cart.component';
import { CartUpdateComponent } from './admin/cart-update/cart-update.component';
import { CustomerControllerComponent } from './admin/customer-controller/customer-controller.component';
import { DishControllerComponent } from './admin/dish-controller/dish-controller.component';
import { FoodStyleControllerComponent } from './admin/food-style-controller/food-style-controller.component';
import { ProductControllerComponent } from './admin/product-controller/product-controller.component';
import { RestaurantControllerComponent } from './admin/restaurant-controller/restaurant-controller.component';*/

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
  //  GoogleMapComponent,
    RegistrationFormComponent,
    CustomerAccountComponent,
    SettingsComponent,
    WorkspaceParametersComponent,
    RatingComponent,
    MapSearchComponent,
    WorkplaceComponent,
    SchedulerComponent,
    //SpecialProductsComponent,
    //FoodStyleComponent,
    //IngredientComponent,
    //FoodStyleProductsComponent,
    //FavouriteDishesComponent,
    //RestaurantPageComponent,
    //CartComponent,
    //FoodOrderComponent,
    //FoodOrderArchivComponent,
    //BoxMapComponent,
    //AddressesComponent,
    //AddressUpdateComponent,
    //AddressCreateComponent,
    //AccountControllerComponent,
    //CartControllerComponent,
    //CreateCartComponent,
    //CartUpdateComponent,
    //CustomerControllerComponent,
    //DishControllerComponent,
    //FoodStyleControllerComponent,
    //ProductControllerComponent,
    //RestaurantControllerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    HttpModule,
    UiModule,
    DlDateTimePickerDateModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),
  TranslateModule.forChild({
    loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
})
  ],
  providers: [APIClient, UserService, ConfigService, EventService],
  bootstrap: [AppComponent],
})
export class AppModule { }
