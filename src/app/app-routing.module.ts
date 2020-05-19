import { LandlordBuildingsComponent } from './landlord-buildings/landlord-buildings.component';
import { LandlordAccountComponent } from './landlord-account/landlord-account.component';
import { BookingsComponent } from './bookings/bookings.component';
import { VisionDiagramsComponent } from './vision-diagrams/vision-diagrams.component';
import { LandlordsComponent } from './landlords/landlords.component';
import { BuildingsComponent } from './buildings/buildings.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { MapSearchComponent } from './map-search/map-search.component';
import { WorkspaceParametersComponent } from './workspace-parameters/workspace-parameters.component';
import { SettingsComponent } from './settings/settings.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { HttpModule } from '@angular/http';
import { LandingPageComponent } from './ui/landing-page/landing-page.component';
import { CustomerAccountComponent } from './customer-account/customer-account.component';
import { WorkplaceComponent } from './workplace/workplace.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { ClientsAdminComponent } from './clients-admin/clients-admin.component';
import { EquipmentAdminComponent } from './equipment-admin/equipment-admin.component';
import { BuildingsAdminComponent } from './buildings-admin/buildings-admin.component';
import { WorkplaceAdminComponent } from './workplace-admin/workplace-admin.component';
import { BookingsArchiveComponent } from './bookings-archive/bookings-archive.component';
import { BookingEditComponent } from './booking-edit/booking-edit.component';
import { BuildingCreateComponent } from './building-create/building-create.component';
import { BuildingEditComponent } from './building-edit/building-edit.component';
import { WorkplacesComponent } from './workplaces/workplaces.component';
import { WorkplaceEditComponent } from './workplace-edit/workplace-edit.component';

const routes: Routes = [
                         { path: '', redirectTo: 'welcome', pathMatch: 'full' },
                         { path: 'welcome', component: LandingPageComponent},
                         { path: 'login', component: LoginFormComponent},
                         { path: 'register', component: RegistrationFormComponent},
                         { path: 'home', component: CustomerAccountComponent},
                         { path: 'settings', component: SettingsComponent},
                         { path: 'workplace-parameters', component: WorkspaceParametersComponent},
                         { path: 'map-search', component: MapSearchComponent},
                         { path: 'map-search/workplace/:workplaceId', component: WorkplaceComponent},
                         { path: 'scheduler', component: SchedulerComponent},
                         { path: 'statistics', component: StatisticsComponent},
                         { path: 'buildings', component: BuildingsComponent},
                         { path: 'landlords', component: LandlordsComponent},
                         { path: 'clients-admin', component: ClientsAdminComponent},
                         { path: 'equipment-admin', component: EquipmentAdminComponent},
                         { path: 'buildings-admin', component: BuildingsAdminComponent},
                         { path: 'workplace-admin', component: WorkplaceAdminComponent},
                         { path: 'vision-diagrams', component: VisionDiagramsComponent},
                         { path: 'bookings/future-bookings', component: BookingsComponent},
                         { path: 'bookings/bookings-archive', component: BookingsArchiveComponent},
                         { path: 'bookings/booking-edit/:workplaceOrderId', component: BookingEditComponent},
                         { path: 'home-landlord', component: LandlordAccountComponent},
                         { path: 'landlord-buildings', component: LandlordBuildingsComponent},
                         { path: 'building-create', component: BuildingCreateComponent},
                         { path: 'building-edit/:buildingId', component: BuildingEditComponent},
                         { path: 'building/workplaces/:buildingId', component: WorkplacesComponent},
                         { path: 'workplace-edit/:workplaceId', component: WorkplaceEditComponent}
                         ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true }), HttpModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
