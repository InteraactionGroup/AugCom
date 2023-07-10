import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportStyleComponent } from './exportStyle.component';
import { Ng2ImgMaxModule } from "ng2-img-max";
import { Router } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

describe('exportStyleComponent', () => {
  let component: ExportStyleComponent;
  let fixture: ComponentFixture<ExportStyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportStyleComponent],
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
    fixture = TestBed.createComponent(ExportStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
