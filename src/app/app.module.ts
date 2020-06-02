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
import { UiModule } from './ui/ui.module';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { CustomerAccountComponent } from './customer-account/customer-account.component';
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SettingsComponent } from './settings/settings.component';
import { WorkspaceParametersComponent } from './workspace-parameters/workspace-parameters.component';
import { RatingComponent } from './rating/rating.component';
import { MapSearchComponent } from './map-search/map-search.component';
import { WorkplaceComponent } from './workplace/workplace.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import {EventService} from './event.service';
import { StatisticsComponent } from './statistics/statistics.component';
import { ChartsModule } from 'ng2-charts';
import { BuildingsComponent } from './buildings/buildings.component';
import { LandlordsComponent } from './landlords/landlords.component';
import { ClientsAdminComponent } from './clients-admin/clients-admin.component';
import { EquipmentAdminComponent } from './equipment-admin/equipment-admin.component';
import { BuildingsAdminComponent } from './buildings-admin/buildings-admin.component';
import { WorkplaceAdminComponent } from './workplace-admin/workplace-admin.component';
import { VisionDiagramsComponent } from './vision-diagrams/vision-diagrams.component';
import { BookingsComponent } from './bookings/bookings.component';
import { RouterModule } from '@angular/router';
import { BookingsArchiveComponent } from './bookings-archive/bookings-archive.component';
import { BookingEditComponent } from './booking-edit/booking-edit.component';
import { LandlordAccountComponent } from './landlord-account/landlord-account.component';
import { LandlordBuildingsComponent } from './landlord-buildings/landlord-buildings.component';
import { BuildingCreateComponent } from './building-create/building-create.component';
import { BuildingEditComponent } from './building-edit/building-edit.component';
import { WorkplacesComponent } from './workplaces/workplaces.component';
import { WorkplaceEditComponent } from './workplace-edit/workplace-edit.component';
import { BuildingWorkplaceComponent } from './building-workplace/building-workplace.component';
import { OrdersArciveComponent } from './orders-arcive/orders-arcive.component';
import { FutureWorkplaceOrdersComponent } from './future-workplace-orders/future-workplace-orders.component';
import { LandlordEquipmentComponent } from './landlord-equipment/landlord-equipment.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    RegistrationFormComponent,
    CustomerAccountComponent,
    SettingsComponent,
    WorkspaceParametersComponent,
    RatingComponent,
    MapSearchComponent,
    WorkplaceComponent,
    SchedulerComponent,
    StatisticsComponent,
    BuildingsComponent,
    LandlordsComponent,
    ClientsAdminComponent,
    EquipmentAdminComponent,
    BuildingsAdminComponent,
    WorkplaceAdminComponent,
    VisionDiagramsComponent,
    BookingsComponent,
    BookingsArchiveComponent,
    BookingEditComponent,
    LandlordAccountComponent,
    LandlordBuildingsComponent,
    BuildingCreateComponent,
    BuildingEditComponent,
    WorkplacesComponent,
    WorkplaceEditComponent,
    BuildingWorkplaceComponent,
    OrdersArciveComponent,
    FutureWorkplaceOrdersComponent,
    LandlordEquipmentComponent
  ],
  imports: [
    ChartsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserModule,
    HttpModule,
    UiModule,
    RouterModule,
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
