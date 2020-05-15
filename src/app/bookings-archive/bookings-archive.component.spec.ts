import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsArchiveComponent } from './bookings-archive.component';

describe('BookingsArchiveComponent', () => {
  let component: BookingsArchiveComponent;
  let fixture: ComponentFixture<BookingsArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingsArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingsArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
