import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodStyleProductsComponent } from './food-style-products.component';

describe('FoodStyleProductsComponent', () => {
  let component: FoodStyleProductsComponent;
  let fixture: ComponentFixture<FoodStyleProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodStyleProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodStyleProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
