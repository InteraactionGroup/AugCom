import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportSaveUserDialogComponent } from './export-save-user-dialog.component';
import { Ng2ImgMaxModule } from "ng2-img-max";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";

describe('XportSaveUserDialogComponent', () => {
  let component: ExportSaveUserDialogComponent;
  let fixture: ComponentFixture<ExportSaveUserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportSaveUserDialogComponent],
      imports: [Ng2ImgMaxModule, RouterTestingModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportSaveUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
