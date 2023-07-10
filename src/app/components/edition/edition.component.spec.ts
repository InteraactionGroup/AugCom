import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionComponent } from './edition.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Grid, GridElement } from '../../types';

function newBoard(component: any) {
  component.boardService.board = new Grid(
    'gridId',
    'grid',
    2,
    2,
    [new GridElement(
      'elt1',
      'button',
      '',
      'yellow',
      'orange',
      0,
      [{
        DisplayedText: 'testBeforeModif',
        VoiceText: 'testBeforeModif',
        LexicInfos: [{ default: true }],
        ImageID: ''
      }],
      [])],
    [],
    []
  );
}

function addElementToBoard(component: any) {
  component.boardService.board.ElementList.push(
    new GridElement(
      'elt2',
      'button',
      '',
      'red',
      'green',
      0,
      [{
        DisplayedText: 'test2BeforeModif',
        VoiceText: 'test2BeforeModif',
        LexicInfos: [{ default: true }],
        ImageID: ''
      }],
      []));
}

function clickElementOf(compiled: any, fixture: any, selector: any, textIncluded: any) {
  compiled.querySelectorAll(selector).forEach(
    elt => {
      if (elt.textContent.includes(textIncluded)) {
        elt.click();
      }
    }
  );
  fixture.detectChanges();
}

function expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled: any, openElementName: any) {
  const tabNameList = ['app-event', 'app-alternative-forms', 'app-image-selection-page', 'app-information-edition-page'];
  tabNameList.forEach(tabName => {
    if (tabName === openElementName) {
      expect(compiled.querySelector(tabName)).not.toBe(null);
    } else {
      expect(compiled.querySelector(tabName)).toBe(null);
    }
  });
}

describe('EditionComponent', () => {
  let component: EditionComponent;
  let fixture: ComponentFixture<EditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, Ng2ImgMaxModule, HttpClientModule],
      providers: [{
        provide: Router, useClass: class {
          navigate = jasmine.createSpy('navigate');
        }
      }],
      declarations: [EditionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.boardService.board = new Grid('gridId', 'grid', 2, 2, [], [], []);
    component.indexedDBacess.loadUsersList();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display app-event when Interactions is clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    clickElementOf(compiled, fixture, '.menu-item-title-container', 'Interactions');
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled, 'app-event');
  });

  it('should display app-alternative-forms when Formes Alternatives is clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    clickElementOf(compiled, fixture, '.menu-item-title-container', 'Formes Alternatives');
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled, 'app-alternative-forms');
  });

  it('should display app-image-selection-page when Apparence is clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    clickElementOf(compiled, fixture, '.menu-item-title-container', 'Apparence');
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled, 'app-image-selection-page');
  });

  it('should display app-information-edition-page when Informations is clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    clickElementOf(compiled, fixture, '.menu-item-title-container', 'Informations');
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled, 'app-information-edition-page');
  });

  it('should add element to save', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.currentEditPage = '';
    component.editionService.add = true;
    component.editionService.name = 'test';
    component.editionService.curentBorderColor = 'black';
    component.editionService.curentColor = 'white';

    newBoard(component);
    fixture.detectChanges();

    compiled.querySelector('.save').click();
    fixture.detectChanges();

    expect(component.boardService.board.ElementList.length).toBe(2);
    expect(component.boardService.board.ElementList[1].ElementFormsList[0].DisplayedText).toBe('test');
    expect(component.gridElementService.getStyle(component.boardService.board.ElementList[1]).BorderColor).toBe('black');
    expect(component.gridElementService.getStyle(component.boardService.board.ElementList[1]).BackgroundColor).toBe('white');
  });

  it('should modify an element of save', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.currentEditPage = '';

    newBoard(component);
    fixture.detectChanges();

    expect(component.boardService.board.ElementList.length).toBe(1);

    component.editionService.selectedElements = [component.boardService.board.ElementList[0]];

    component.updateModifications();

    component.editionService.add = false;
    component.editionService.name = 'test';
    component.editionService.curentBorderColor = 'black';
    component.editionService.curentColor = 'white';

    compiled.querySelector('.save').click();
    fixture.detectChanges();

    expect(component.boardService.board.ElementList.length).toBe(1);
    expect(component.boardService.board.ElementList[0].ElementFormsList[0].DisplayedText).toBe('test');
    expect(component.gridElementService.getStyle(component.boardService.board.ElementList[0]).BorderColor).toBe('black');
    expect(component.gridElementService.getStyle(component.boardService.board.ElementList[0]).BackgroundColor).toBe('white');
  });

  it('should not modify an element of save if there was no modif on edition panel', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.currentEditPage = '';

    newBoard(component);
    fixture.detectChanges();

    expect(component.boardService.board.ElementList.length).toBe(1);

    component.editionService.selectedElements = [component.boardService.board.ElementList[0]];

    component.updateModifications();

    component.editionService.add = false;

    compiled.querySelector('.save').click();
    fixture.detectChanges();

    expect(component.boardService.board.ElementList.length).toBe(1);
    expect(component.boardService.board.ElementList[0].ElementFormsList[0].DisplayedText).toBe('testBeforeModif');
    expect(component.gridElementService.getStyle(component.boardService.board.ElementList[0]).BorderColor).toBe('orange');
    expect(component.gridElementService.getStyle(component.boardService.board.ElementList[0]).BackgroundColor).toBe('yellow');
  });

  it('should modify multiple element of save but not their name', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.currentEditPage = '';

    newBoard(component);
    addElementToBoard(component);
    fixture.detectChanges();

    expect(component.boardService.board.ElementList.length).toBe(2);

    component.editionService.selectedElements = [component.boardService.board.ElementList[0], component.boardService.board.ElementList[1]];

    component.updateModifications();

    component.editionService.add = false;
    component.editionService.name = 'test';
    component.editionService.curentBorderColor = 'black';
    component.editionService.curentColor = 'white';

    compiled.querySelector('.save').click();
    fixture.detectChanges();

    expect(component.boardService.board.ElementList.length).toBe(2);

    expect(component.boardService.board.ElementList[0].ElementFormsList[0].DisplayedText).toBe('testBeforeModif');
    expect(component.gridElementService.getStyle(component.boardService.board.ElementList[0]).BorderColor).toBe('black');
    expect(component.gridElementService.getStyle(component.boardService.board.ElementList[0]).BackgroundColor).toBe('white');


    expect(component.boardService.board.ElementList[1].ElementFormsList[0].DisplayedText).toBe('test2BeforeModif');
    expect(component.gridElementService.getStyle(component.boardService.board.ElementList[1]).BorderColor).toBe('black');
    expect(component.gridElementService.getStyle(component.boardService.board.ElementList[1]).BackgroundColor).toBe('white');
  });

  it('should not modify multiple element of save if they have not been modify in edition panel', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.currentEditPage = '';

    newBoard(component);
    addElementToBoard(component);
    fixture.detectChanges();

    expect(component.boardService.board.ElementList.length).toBe(2);

    component.editionService.selectedElements = [component.boardService.board.ElementList[0], component.boardService.board.ElementList[1]];

    component.updateModifications();

    component.editionService.add = false;

    compiled.querySelector('.save').click();
    fixture.detectChanges();

    expect(component.boardService.board.ElementList.length).toBe(2);

    expect(component.boardService.board.ElementList[0].ElementFormsList[0].DisplayedText).toBe('testBeforeModif');
    expect(component.gridElementService.getStyle(component.boardService.board.ElementList[0]).BorderColor).toBe('orange');
    expect(component.gridElementService.getStyle(component.boardService.board.ElementList[0]).BackgroundColor).toBe('yellow');


    expect(component.boardService.board.ElementList[1].ElementFormsList[0].DisplayedText).toBe('test2BeforeModif');
    expect(component.gridElementService.getStyle(component.boardService.board.ElementList[1]).BorderColor).toBe('green');
    expect(component.gridElementService.getStyle(component.boardService.board.ElementList[1]).BackgroundColor).toBe('red');
  });
  /*
    it('should change the color value when a color is selected', () => {
      const compiled = fixture.debugElement.nativeElement;
      clickElementOf(compiled, fixture, '.menu-item-title-container', 'Apparence');
      component.editionService.colorPicked = 'inside';
      component.editionService.selectedPalette = '22 magic colors';
      fixture.detectChanges();
  
      compiled.querySelector('.color').click();
      fixture.detectChanges();
  
      compiled.querySelector('.close').click();
      fixture.detectChanges();
  
      expect(component.editionService.curentColor).toEqual('#800000')
    });
  
  
    it('should change the bordercolor value when a bordercolor is selected', () => {
      const compiled = fixture.debugElement.nativeElement;
      clickElementOf(compiled, fixture, '.menu-item-title-container', 'Apparence');
      component.editionService.colorPicked = 'border';
      component.editionService.selectedPalette = '22 magic colors';
      fixture.detectChanges();
  
      compiled.querySelector('.color').click();
      fixture.detectChanges();
  
      compiled.querySelector('.close').click();
      fixture.detectChanges();
  
      expect(component.editionService.curentBorderColor).toEqual('#800000')
    });
  */
});
