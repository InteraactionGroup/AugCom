import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportComponent } from './export.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';

describe('ExportComponent', () => {
  let component: ExportComponent;
  let fixture: ComponentFixture<ExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportComponent],
      imports: [Ng2ImgMaxModule, HttpClientModule, BrowserAnimationsModule, RouterTestingModule, MatDialogModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
