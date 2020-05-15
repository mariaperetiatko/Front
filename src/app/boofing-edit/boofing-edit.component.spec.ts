import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoofingEditComponent } from './boofing-edit.component';

describe('BoofingEditComponent', () => {
  let component: BoofingEditComponent;
  let fixture: ComponentFixture<BoofingEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoofingEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoofingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
