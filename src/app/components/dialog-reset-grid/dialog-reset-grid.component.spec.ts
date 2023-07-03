import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogResetGridComponent } from './dialog-reset-grid.component';
import { Ng2ImgMaxModule } from "ng2-img-max";
import { Router } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

describe('DialogResetGridComponent', () => {
  let component: DialogResetGridComponent;
  let fixture: ComponentFixture<DialogResetGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogResetGridComponent],
      imports: [Ng2ImgMaxModule, HttpClientModule],
      providers: [{
        provide: Router, useClass: class {
          navigate = jasmine.createSpy('navigate');
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogResetGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
