import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodOrderArchivComponent } from './food-order-archiv.component';

describe('FoodOrderArchivComponent', () => {
  let component: FoodOrderArchivComponent;
  let fixture: ComponentFixture<FoodOrderArchivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodOrderArchivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodOrderArchivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
