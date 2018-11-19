import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodStyleComponent } from './food-style.component';

describe('FoodStyleComponent', () => {
  let component: FoodStyleComponent;
  let fixture: ComponentFixture<FoodStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodStyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
