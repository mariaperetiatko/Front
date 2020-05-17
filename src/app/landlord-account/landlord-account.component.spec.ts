import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandlordAccountComponent } from './landlord-account.component';

describe('LandlordAccountComponent', () => {
  let component: LandlordAccountComponent;
  let fixture: ComponentFixture<LandlordAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandlordAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandlordAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
