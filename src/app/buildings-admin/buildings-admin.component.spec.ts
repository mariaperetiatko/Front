import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingsAdminComponent } from './buildings-admin.component';

describe('BuildingsAdminComponent', () => {
  let component: BuildingsAdminComponent;
  let fixture: ComponentFixture<BuildingsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
