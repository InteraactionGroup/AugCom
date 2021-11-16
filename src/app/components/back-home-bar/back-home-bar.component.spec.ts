import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BackHomeBarComponent} from './back-home-bar.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Ng2ImgMaxModule} from "ng2-img-max";
import {Router} from "@angular/router";

describe('BackHomeBarComponent', () => {
  let component: BackHomeBarComponent;
  let fixture: ComponentFixture<BackHomeBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, Ng2ImgMaxModule],
      declarations: [BackHomeBarComponent],
      providers: [{
        provide: Router, useClass: class {
          navigate = jasmine.createSpy('navigate');
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackHomeBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
