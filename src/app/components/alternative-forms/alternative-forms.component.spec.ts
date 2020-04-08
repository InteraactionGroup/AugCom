import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AlternativeFormsComponent} from './alternative-forms.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";

describe('AlternativeFormsComponent', () => {
  let component: AlternativeFormsComponent;
  let fixture: ComponentFixture<AlternativeFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      declarations: [AlternativeFormsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternativeFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
