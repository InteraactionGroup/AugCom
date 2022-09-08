import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogExportPagesComponent } from './dialog-export-pages.component';
import {Ng2ImgMaxModule} from "ng2-img-max";
import {RouterTestingModule} from "@angular/router/testing";
import {MatDialogModule} from "@angular/material/dialog";
import {HttpClientModule} from "@angular/common/http";

describe('DialogExportPagesComponent', () => {
  let component: DialogExportPagesComponent;
  let fixture: ComponentFixture<DialogExportPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogExportPagesComponent ],
      imports: [Ng2ImgMaxModule, RouterTestingModule, MatDialogModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogExportPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
