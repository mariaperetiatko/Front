import { CartComponent } from './cart/cart.component';
import { RestaurantPageComponent } from './restaurant-page/restaurant-page.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { HttpModule } from '@angular/http';
import { LandingPageComponent } from './ui/landing-page/landing-page.component';
import { CustomerAccountComponent } from './customer-account/customer-account.component';
import { SpecialProductsComponent } from './special-products/special-products.component';
import { FoodStyleComponent } from './food-style/food-style.component';
import { IngredientComponent } from './ingredient/ingredient.component';
import { FavouriteDishesComponent } from './favourite-dishes/favourite-dishes.component';

const routes: Routes = [
                         { path: '', redirectTo: 'welcome', pathMatch: 'full' },
                         { path: 'welcome', component: LandingPageComponent},
                         { path: 'login', component: LoginFormComponent},
                         { path: 'register', component: RegistrationFormComponent},
                         { path: 'home', component: CustomerAccountComponent},
                         { path: 'specialProducts', component: SpecialProductsComponent},
                         { path: 'ingredients', component: IngredientComponent},
                         { path: 'foodStyle', component: FoodStyleComponent},
                         { path: 'foodStyleProducts', component: FoodStyleComponent},
                         { path: 'favouriteDishes', component: FavouriteDishesComponent},
                         { path: 'restaurantPage', component: RestaurantPageComponent},
                         { path: 'cart', component: CartComponent},
                         { path: 'map', component: GoogleMapComponent } ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true }), HttpModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
