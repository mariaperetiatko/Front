import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandlordEquipmentComponent } from './landlord-equipment.component';

describe('LandlordEquipmentComponent', () => {
  let component: LandlordEquipmentComponent;
  let fixture: ComponentFixture<LandlordEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandlordEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandlordEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
