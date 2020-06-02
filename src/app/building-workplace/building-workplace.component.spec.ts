import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingWorkplaceComponent } from './building-workplace.component';

describe('BuildingWorkplaceComponent', () => {
  let component: BuildingWorkplaceComponent;
  let fixture: ComponentFixture<BuildingWorkplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingWorkplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingWorkplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
