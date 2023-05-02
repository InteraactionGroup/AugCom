import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AlternativeFormsComponent} from './alternative-forms.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {Ng2ImgMaxModule} from 'ng2-img-max';
import {ElementForm, GridElement} from '../../types';
import {Router} from "@angular/router";

function updateModifications(component: any) {
  if (component.editionService.selectedElements.length === 1) {
    const elementToModif: GridElement = component.editionService.selectedElements[0];
    if (elementToModif.ElementFormsList != null && elementToModif.ElementFormsList !== undefined) {
      component.editionService.variantList = Object.assign([], elementToModif.ElementFormsList);
    } else {
      component.editionService.variantList = [];
    }
  }
}

function createElement(component: any, id: any, numberOfElementForms: number) {
  const elementForms: ElementForm[] = [];
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
      '',
      'white',
      'black',
      0,
      elementForms,
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
      declarations: [AlternativeFormsComponent],
      providers: [{
        provide: Router, useClass: class {
          navigate = jasmine.createSpy('navigate');
        }
      }]
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
    expect(compiled.querySelector('.tableTitle')).toBe(null);
    expect(compiled.querySelector('.alternativeElementVariant')).toBe(null);
  });

  it('should not display app-error-on-edit if an element exists', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.selectedElements = [];
    createElements(component, 1, 1);
    updateModifications(component);
    fixture.detectChanges();
    expect(compiled.querySelector('app-error-on-edit')).toBe(null);
    expect(compiled.querySelector('.tableTitle')).not.toBe(null);
    expect(compiled.querySelector('.alternativeElementVariant')).not.toBe(null);
    expect(compiled.querySelectorAll('.addButton')).not.toBe(null);
  });

  it('should create the good number of previewed elements for one element selected', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.selectedElements = [];
    createElements(component, 1, 11);
    updateModifications(component);
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.elementContainer').length).toEqual(10);
  });

  it('should create the good number of previewed elements for one element selected', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.selectedElements = [];
    createElements(component, 1, 2);
    updateModifications(component);
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.elementContainer').length).toEqual(1);
    expect(compiled.querySelectorAll('.addButton')).not.toBe(null);
  });

  it('should create the good number of previewed elements for more than one elements selected', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.selectedElements = [];
    createElements(component, 5, 10);
    updateModifications(component);
    fixture.detectChanges();
    expect(compiled.querySelector('.tableTitle').textContent).toContain('L\'édition des variantes des mots est impossible si plus d\'un élément a été sélectionné.');
    expect(compiled.querySelector('.alternativeElementVariant')).toBe(null);
    expect(compiled.querySelector('.elementContainer')).toBe(null);
  });

  it('should create a new variant if addButton and enregistrer les modifications button are pressed', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.selectedElements = [];
    createElements(component, 1, 10);
    updateModifications(component);
    fixture.detectChanges();
    compiled.querySelector('.addButton').click();
    fixture.detectChanges();
    compiled.querySelector('#saveAlternativeFormModifButton').click();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.elementContainer').length).toEqual(10);
  });

  it('should create the first new variant if addButton and saveModif button are pressed and there was no variant before', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.selectedElements = [];
    createElements(component, 1, 1);
    updateModifications(component);
    fixture.detectChanges();
    compiled.querySelector('.addButton').click();
    fixture.detectChanges();
    compiled.querySelector('#saveAlternativeFormModifButton').click();
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.elementContainer').length).toEqual(1);
  });

  it('should create and add the corresponding new created element to the elementFormsList', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.selectedElements = [];
    createElements(component, 1, 1);
    updateModifications(component);
    fixture.detectChanges();
    compiled.querySelector('.addButton').click();
    fixture.detectChanges();
    component.elementFormDisplayedWordField = 'newDisplayedWordTest';
    component.elementFormPronouncedWordField = 'newPronouncedWordTest';
    component.elementFormNameImageURL = 'src\assets\libs\arasaac\0a1c2dd4ecbf4cd76cf14bedceda1b515e85d901d6fcb1f95babfd4292c90136.png';
    compiled.querySelector('#saveAlternativeFormModifButton').click();
    fixture.detectChanges();
    expect(component.editionService.variantList[1].DisplayedText).toEqual('newDisplayedWordTest');
    expect(component.editionService.variantList[1].VoiceText).toEqual('newPronouncedWordTest');
    const relatedImage = component.boardService.board.ImageList.find(image => {
      return image.Path === 'src\assets\libs\arasaac\0a1c2dd4ecbf4cd76cf14bedceda1b515e85d901d6fcb1f95babfd4292c90136.png'
    });
    expect(component.editionService.variantList[1].ImageID).toEqual(relatedImage.ID);
    expect(relatedImage).not.toBe(null);
  });

});
