import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplaceEditComponent } from './workplace-edit.component';

describe('WorkplaceEditComponent', () => {
  let component: WorkplaceEditComponent;
  let fixture: ComponentFixture<WorkplaceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkplaceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkplaceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
