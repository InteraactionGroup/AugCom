import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, HttpClientModule],
      declarations: [ContactComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
