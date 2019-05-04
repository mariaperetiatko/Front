import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplaceAdminComponent } from './workplace-admin.component';

describe('WorkplaceAdminComponent', () => {
  let component: WorkplaceAdminComponent;
  let fixture: ComponentFixture<WorkplaceAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkplaceAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkplaceAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
