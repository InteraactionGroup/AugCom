import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogbarComponent} from './dialogbar.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Ng2ImgMaxModule} from "ng2-img-max";

describe('DialogbarComponent', () => {
  let component: DialogbarComponent;
  let fixture: ComponentFixture<DialogbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, Ng2ImgMaxModule],
      declarations: [DialogbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
