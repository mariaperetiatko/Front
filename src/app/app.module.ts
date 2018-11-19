import { ConfigService } from './config.service';
import { UserService } from './user.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { Client } from './api.service';
import { LoginFormComponent } from './login-form/login-form.component';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { UiModule } from './ui/ui.module';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { CustomerAccountComponent } from './customer-account/customer-account.component';
import { SpecialProductsComponent } from './special-products/special-products.component';
import { FoodStyleComponent } from './food-style/food-style.component';
import { IngredientComponent } from './ingredient/ingredient.component';
import { FoodStyleProductsComponent } from './food-style-products/food-style-products.component';
import { FavouriteDishesComponent } from './favourite-dishes/favourite-dishes.component';
import { RestaurantPageComponent } from './restaurant-page/restaurant-page.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    CustomerListComponent,
    GoogleMapComponent,
    RegistrationFormComponent,
    CustomerAccountComponent,
    SpecialProductsComponent,
    FoodStyleComponent,
    IngredientComponent,
    FoodStyleProductsComponent,
    FavouriteDishesComponent,
    RestaurantPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    HttpModule,
    UiModule
  ],
  providers: [Client, UserService, ConfigService],
  bootstrap: [AppComponent],
})
export class AppModule { }