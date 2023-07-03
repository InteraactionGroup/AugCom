import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelGridComponent } from './model-grid.component';
import { Ng2ImgMaxModule } from "ng2-img-max";
import { RouterTestingModule } from "@angular/router/testing";
import { MatDialogModule } from "@angular/material/dialog";
import { HttpClientModule } from "@angular/common/http";

describe('ModelPageComponent', () => {
  let component: ModelGridComponent;
  let fixture: ComponentFixture<ModelGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModelGridComponent],
      imports: [Ng2ImgMaxModule, RouterTestingModule, MatDialogModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
