import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureWorkplaceOrdersComponent } from './future-workplace-orders.component';

describe('FutureWorkplaceOrdersComponent', () => {
  let component: FutureWorkplaceOrdersComponent;
  let fixture: ComponentFixture<FutureWorkplaceOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FutureWorkplaceOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FutureWorkplaceOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
