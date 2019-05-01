import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceParametersComponent } from './workspace-parameters.component';

describe('WorkspaceParametersComponent', () => {
  let component: WorkspaceParametersComponent;
  let fixture: ComponentFixture<WorkspaceParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
