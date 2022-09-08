import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePageComponent } from './delete-page.component';
import {Ng2ImgMaxModule} from "ng2-img-max";
import {MatDialogModule} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";

describe('DeletePageComponent', () => {
  let component: DeletePageComponent;
  let fixture: ComponentFixture<DeletePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletePageComponent ],
      imports: [Ng2ImgMaxModule, MatDialogModule, HttpClientModule],
      providers: [{
        provide: Router, useClass: class {
          navigate = jasmine.createSpy('navigate');
        }
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
