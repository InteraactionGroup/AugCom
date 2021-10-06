import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPrintComponent } from './header-print.component';
import {Ng2ImgMaxModule} from "ng2-img-max";

describe('HeaderPrintComponent', () => {
  let component: HeaderPrintComponent;
  let fixture: ComponentFixture<HeaderPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderPrintComponent ],
      imports: [Ng2ImgMaxModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
