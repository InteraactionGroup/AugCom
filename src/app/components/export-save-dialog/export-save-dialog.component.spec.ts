import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExportSaveDialogComponent} from './export-save-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {Ng2ImgMaxModule} from "ng2-img-max";
import {RouterTestingModule} from "@angular/router/testing";

describe('ExportSaveDialogComponent', () => {
  let component: ExportSaveDialogComponent;
  let fixture: ComponentFixture<ExportSaveDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportSaveDialogComponent],
      imports: [MatDialogModule, Ng2ImgMaxModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportSaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
