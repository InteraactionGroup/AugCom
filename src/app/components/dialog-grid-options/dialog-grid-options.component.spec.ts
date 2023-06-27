import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGridOptionsComponent } from './dialog-grid-options.component';
import { HttpClient } from '@angular/common/http';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DialogGridOptionsComponent', () => {
  let component: DialogGridOptionsComponent;
  let fixture: ComponentFixture<DialogGridOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClient, Ng2ImgMaxModule, MatDialogModule, BrowserAnimationsModule],
      declarations: [ DialogGridOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGridOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
