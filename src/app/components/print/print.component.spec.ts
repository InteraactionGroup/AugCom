import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrintComponent} from './print.component';
import {Ng2ImgMaxModule} from 'ng2-img-max';
import {Router} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";

describe('PrintComponent', () => {
  let component: PrintComponent;
  let fixture: ComponentFixture<PrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrintComponent],
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
    fixture = TestBed.createComponent(PrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
