import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxMapComponent } from './box-map.component';

describe('BoxMapComponent', () => {
  let component: BoxMapComponent;
  let fixture: ComponentFixture<BoxMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
