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
import { BoofingEditComponent } from './boofing-edit/boofing-edit.component';
import { RouterModule } from '@angular/router';
import { BookingsArchiveComponent } from './bookings-archive/bookings-archive.component';

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
    BoofingEditComponent,
    BookingsArchiveComponent
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
