import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGridOptionsComponent } from './dialog-grid-options.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DialogGridOptionsComponent', () => {
  let component: DialogGridOptionsComponent;
  let fixture: ComponentFixture<DialogGridOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, MatDialogModule, BrowserAnimationsModule],
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
