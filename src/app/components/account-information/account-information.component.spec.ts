import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInformationComponent } from './account-information.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { HttpClientModule } from "@angular/common/http";

describe('AccountInformationComponent', () => {
  let component: AccountInformationComponent;
  let fixture: ComponentFixture<AccountInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, Ng2ImgMaxModule, HttpClientModule],
      declarations: [AccountInformationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
