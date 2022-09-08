import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResetSettingsComponent } from './dialog-reset-settings.component';
import {MatDialogModule} from '@angular/material/dialog';
import {HttpClientModule} from "@angular/common/http";

describe('DialogResetSettingsComponent', () => {
  let component: DialogResetSettingsComponent;
  let fixture: ComponentFixture<DialogResetSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogResetSettingsComponent ],
      imports: [HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogResetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
