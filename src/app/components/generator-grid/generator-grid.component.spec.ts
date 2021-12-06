import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorGridComponent } from './generator-grid.component';
import {FormsModule} from "@angular/forms";
import {Ng2ImgMaxModule} from "ng2-img-max";
import {HttpClientModule} from "@angular/common/http";
import {Router} from "@angular/router";

describe('GeneratorGridComponent', () => {
  let component: GeneratorGridComponent;
  let fixture: ComponentFixture<GeneratorGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratorGridComponent ],
      imports: [FormsModule, Ng2ImgMaxModule, HttpClientModule],
      providers: [{
        provide: Router, useClass: class {
          navigate = jasmine.createSpy('navigate');
        }
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratorGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
