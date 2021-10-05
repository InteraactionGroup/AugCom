import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPrintComponent } from './footer-print.component';

describe('FooterPrintComponent', () => {
  let component: FooterPrintComponent;
  let fixture: ComponentFixture<FooterPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
