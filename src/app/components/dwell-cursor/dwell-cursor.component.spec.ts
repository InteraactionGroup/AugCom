import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwellCursorComponent } from './dwell-cursor.component';

describe('DwellCursorComponent', () => {
  let component: DwellCursorComponent;
  let fixture: ComponentFixture<DwellCursorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwellCursorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwellCursorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
