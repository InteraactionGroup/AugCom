import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterPrintComponent } from './footer-print.component';
import {Ng2ImgMaxModule} from "ng2-img-max";
import {Router} from "@angular/router";

describe('FooterPrintComponent', () => {
  let component: FooterPrintComponent;
  let fixture: ComponentFixture<FooterPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterPrintComponent ],
      imports: [Ng2ImgMaxModule],
      providers: [{
        provide: Router, useClass: class {
          navigate = jasmine.createSpy('navigate');
        }
      }]
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
