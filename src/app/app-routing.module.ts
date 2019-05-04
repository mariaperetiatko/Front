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

const routes: Routes = [
                         { path: '', redirectTo: 'welcome', pathMatch: 'full' },
                         { path: 'welcome', component: LandingPageComponent},
                         { path: 'login', component: LoginFormComponent},
                         { path: 'register', component: RegistrationFormComponent},
                         { path: 'home', component: CustomerAccountComponent},
                         { path: 'settings', component: SettingsComponent},
                         { path: 'workplace-parameters', component: WorkspaceParametersComponent},
                         { path: 'map-search', component: MapSearchComponent},
                         { path: 'workplace', component: WorkplaceComponent},
                         { path: 'scheduler', component: SchedulerComponent},
                         { path: 'statistics', component: StatisticsComponent},
                         { path: 'buildings', component: BuildingsComponent},
                         { path: 'landlords', component: LandlordsComponent},
                         { path: 'clients-admin', component: ClientsAdminComponent},
                         { path: 'equipment-admin', component: EquipmentAdminComponent},
                         { path: 'buildings-admin', component: BuildingsAdminComponent},
                         { path: 'workplace-admin', component: WorkplaceAdminComponent}

                         ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true }), HttpModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
