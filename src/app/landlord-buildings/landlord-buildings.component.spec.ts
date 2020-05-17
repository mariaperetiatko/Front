import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandlordBuildingsComponent } from './landlord-buildings.component';

describe('LandlordBuildingsComponent', () => {
  let component: LandlordBuildingsComponent;
  let fixture: ComponentFixture<LandlordBuildingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandlordBuildingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandlordBuildingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
