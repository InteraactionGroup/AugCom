import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GridFormatManagementComponent} from './grid-format-management.component';
import {Ng2ImgMaxModule} from 'ng2-img-max';
import {Router} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";

describe('GridFormatManagementComponent', () => {
  let component: GridFormatManagementComponent;
  let fixture: ComponentFixture<GridFormatManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [Ng2ImgMaxModule, HttpClientModule],
      declarations: [GridFormatManagementComponent],
      providers: [{
        provide: Router, useClass: class {
          navigate = jasmine.createSpy('navigate');
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridFormatManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
