import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPageComponent } from './user-page.component';
import {ImgExifService, ImgMaxPXSizeService, ImgMaxSizeService, Ng2ImgMaxModule, Ng2ImgMaxService} from "ng2-img-max";
import {FormBuilder, FormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {RouterTestingModule} from "@angular/router/testing";

describe('UserPageComponent', () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPageComponent ],
      providers: [FormBuilder],
      imports: [FormsModule, Ng2ImgMaxModule, RouterTestingModule, MatDialogModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
