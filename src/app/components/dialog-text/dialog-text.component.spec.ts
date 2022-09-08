import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTextComponent } from './dialog-text.component';
import {HttpClientModule} from "@angular/common/http";

describe('DialogTextComponent', () => {
  let component: DialogTextComponent;
  let fixture: ComponentFixture<DialogTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTextComponent ],
      imports:[HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
