import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UsertoolbarComponent} from './usertoolbar.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Ng2ImgMaxModule} from "ng2-img-max";

describe('UsertoolbarComponent', () => {
  let component: UsertoolbarComponent;
  let fixture: ComponentFixture<UsertoolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, Ng2ImgMaxModule],
      declarations: [UsertoolbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsertoolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
