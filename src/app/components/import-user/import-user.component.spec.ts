import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportUserComponent } from './import-user.component';
import { Ng2ImgMaxModule } from "ng2-img-max";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";

describe('ImportUserComponent', () => {
  let component: ImportUserComponent;
  let fixture: ComponentFixture<ImportUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportUserComponent],
      imports: [Ng2ImgMaxModule, RouterTestingModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
