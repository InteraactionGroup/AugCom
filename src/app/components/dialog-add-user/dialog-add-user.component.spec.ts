import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddUserComponent } from './dialog-add-user.component';
import { Ng2ImgMaxModule } from "ng2-img-max";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

describe('DialogAddUserComponent', () => {
  let component: DialogAddUserComponent;
  let fixture: ComponentFixture<DialogAddUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogAddUserComponent],
      imports: [Ng2ImgMaxModule, FormsModule, HttpClientModule],
      providers: [{
        provide: Router, useClass: class {
          navigate = jasmine.createSpy('navigate');
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
