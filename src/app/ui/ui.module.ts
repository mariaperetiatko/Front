import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LandingPageComponent } from './landing-page/landing-page.component';


@NgModule({
  declarations: [HeaderComponent, FooterComponent, LayoutComponent, LandingPageComponent],
  imports: [
    CommonModule,
    NgbModule.forRoot()
  ],
  exports: [LayoutComponent, LandingPageComponent]

})
export class UiModule { }
