import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLogoutAppComponent } from './dialog-logout-app.component';
import {HttpClientModule} from "@angular/common/http";

describe('DialogLogoutAppComponent', () => {
  let component: DialogLogoutAppComponent;
  let fixture: ComponentFixture<DialogLogoutAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogLogoutAppComponent ],
      imports: [HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLogoutAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
