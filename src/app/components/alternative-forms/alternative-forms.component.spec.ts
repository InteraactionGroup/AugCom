import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AlternativeFormsComponent} from './alternative-forms.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {Ng2ImgMaxModule} from "ng2-img-max";
import {GridElement} from "../../types";

function createElement(component: any, id: any, numberOfElementForms: number) {
  let elementForms = [];
  for (let i = 0; i < numberOfElementForms; i++) {
    elementForms.push({
      DisplayedText: id + i,
      VoiceText: id + i,
      LexicInfos: [],
      ImageID: id + i
    });
  }
  component.editionService.selectedElements.push(
    new GridElement(
      id,
      'button',
      [],
      'white',
      'black',
      0,
      [],
      [])
  );
}

  function createElements(component: any, numberOfElements: number, numberOfElementFormsPerElements: number) {
    for (let i = 0; i < numberOfElements; i++) {
      createElement(component, i, numberOfElementFormsPerElements);
    }
  }

describe('AlternativeFormsComponent', () => {
  let component: AlternativeFormsComponent;
  let fixture: ComponentFixture<AlternativeFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, Ng2ImgMaxModule, HttpClientModule],
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

  it('should display app-error-on-edit if no element exists', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.selectedElements = [];
    fixture.detectChanges();
    expect(compiled.querySelector('app-error-on-edit')).not.toBe(null);
  });

  it('should not display app-error-on-edit if an element exists', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.selectedElements = [];
    createElements(component,1,1);
    fixture.detectChanges();
    expect(compiled.querySelector('app-error-on-edit')).toBe(null);
  });

});
