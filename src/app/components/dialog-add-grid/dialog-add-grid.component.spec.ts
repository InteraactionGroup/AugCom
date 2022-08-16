import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddGridComponent } from './dialog-add-grid.component';
import {Ng2ImgMaxModule} from "ng2-img-max";
import {RouterTestingModule} from "@angular/router/testing";

describe('DialogAddGridComponent', () => {
  let component: DialogAddGridComponent;
  let fixture: ComponentFixture<DialogAddGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddGridComponent ],
      imports: [Ng2ImgMaxModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
