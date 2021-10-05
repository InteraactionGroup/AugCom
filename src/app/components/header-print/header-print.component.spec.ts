import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPrintComponent } from './header-print.component';

describe('HeaderPrintComponent', () => {
  let component: HeaderPrintComponent;
  let fixture: ComponentFixture<HeaderPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
