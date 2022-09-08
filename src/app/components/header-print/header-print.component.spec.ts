import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPrintComponent } from './header-print.component';
import {Ng2ImgMaxModule} from "ng2-img-max";
import {Router} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";

describe('HeaderPrintComponent', () => {
  let component: HeaderPrintComponent;
  let fixture: ComponentFixture<HeaderPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderPrintComponent ],
      imports: [Ng2ImgMaxModule, HttpClientModule],
      providers: [{
        provide: Router, useClass: class {
          navigate = jasmine.createSpy('navigate');
        }
      }]
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
