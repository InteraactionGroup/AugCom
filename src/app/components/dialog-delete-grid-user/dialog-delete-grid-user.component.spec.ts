import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteGridUserComponent } from './dialog-delete-grid-user.component';
import {Ng2ImgMaxModule} from "ng2-img-max";
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientModule} from "@angular/common/http";

describe('DialogDeleteGridUserComponent', () => {
  let component: DialogDeleteGridUserComponent;
  let fixture: ComponentFixture<DialogDeleteGridUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogDeleteGridUserComponent ],
      imports: [Ng2ImgMaxModule, RouterTestingModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteGridUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
