import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModifyColorBorderComponent } from './dialog-modify-color-border.component';
import {Router} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";

describe('DialogModifyColorBorderComponent', () => {
  let component: DialogModifyColorBorderComponent;
  let fixture: ComponentFixture<DialogModifyColorBorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogModifyColorBorderComponent ],
      imports:[HttpClientModule],
      providers: [{
        provide: Router, useClass: class {
          navigate = jasmine.createSpy('navigate');
        }
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModifyColorBorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
