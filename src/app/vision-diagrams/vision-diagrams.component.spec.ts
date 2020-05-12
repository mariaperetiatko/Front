import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionDiagramsComponent } from './vision-diagrams.component';

describe('VisionDiagramsComponent', () => {
  let component: VisionDiagramsComponent;
  let fixture: ComponentFixture<VisionDiagramsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisionDiagramsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisionDiagramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
