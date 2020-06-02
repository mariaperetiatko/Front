import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersArciveComponent } from './orders-arcive.component';

describe('OrdersArciveComponent', () => {
  let component: OrdersArciveComponent;
  let fixture: ComponentFixture<OrdersArciveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersArciveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersArciveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
