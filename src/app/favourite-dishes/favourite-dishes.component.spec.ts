import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteDishesComponent } from './favourite-dishes.component';

describe('FavouriteDishesComponent', () => {
  let component: FavouriteDishesComponent;
  let fixture: ComponentFixture<FavouriteDishesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteDishesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
