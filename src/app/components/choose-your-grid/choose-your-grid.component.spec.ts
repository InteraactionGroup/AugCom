import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseYourGridComponent } from './choose-your-grid.component';
import {Ng2ImgMaxModule} from "ng2-img-max";
import {RouterTestingModule} from "@angular/router/testing";

describe('ChooseYourGridComponent', () => {
  let component: ChooseYourGridComponent;
  let fixture: ComponentFixture<ChooseYourGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseYourGridComponent ],
      imports: [Ng2ImgMaxModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseYourGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
