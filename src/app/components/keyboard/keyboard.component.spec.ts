import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {KeyboardComponent} from './keyboard.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {DragulaModule} from "ng2-dragula";
import {Ng2ImgMaxModule} from "ng2-img-max";
import {Router} from "@angular/router";

describe('KeyboardComponent', () => {
  let component: KeyboardComponent;
  let fixture: ComponentFixture<KeyboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, DragulaModule, Ng2ImgMaxModule],
      providers: [ { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); } }],
      declarations: [KeyboardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
