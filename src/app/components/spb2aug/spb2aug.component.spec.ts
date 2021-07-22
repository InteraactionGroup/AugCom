import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Spb2augComponent } from './spb2aug.component';
import {Ng2ImgMaxModule} from "ng2-img-max";
import {RouterTestingModule} from "@angular/router/testing";

describe('Spb2augComponent', () => {
  let component: Spb2augComponent;
  let fixture: ComponentFixture<Spb2augComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Spb2augComponent ],
      imports: [Ng2ImgMaxModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Spb2augComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
