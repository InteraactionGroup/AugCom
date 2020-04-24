import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditionComponent} from './edition.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Ng2ImgMaxModule} from "ng2-img-max";
import {HttpClientModule} from "@angular/common/http";
import {Router} from "@angular/router";
import {ElementForm, Grid, GridElement} from "../../types";

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
  let tabNameList = ['app-event','app-alternative-forms','app-image-selection-page','app-information-edition-page'];
  tabNameList.forEach( tabName => {
    if(tabName === openElementName){
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
      providers: [ { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); } }],
      declarations: [EditionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.boardService.board = new Grid('gridId', 'grid', 2, 2, [], [], []);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display app-event when Interactions is clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    clickElementOf(compiled, fixture, '.menu-item-title-container', 'Interactions');
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled,'app-event');
  });

  it('should display app-alternative-forms when Autres formes is clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    clickElementOf(compiled, fixture, '.menu-item-title-container', 'Autres formes');
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled,'app-alternative-forms');
  });

  it('should display app-image-selection-page when Apparence is clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    clickElementOf(compiled, fixture, '.menu-item-title-container', 'Apparence');
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled,'app-image-selection-page');
  });

  it('should display app-information-edition-page when Informations is clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    clickElementOf(compiled, fixture, '.menu-item-title-container', 'Informations');
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled,'app-information-edition-page');
  });

  it('should add ellement to save', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.currentEditPage = "";

    component.editionService.add = true;
    component.editionService.name = 'test';
    component.editionService.curentBorderColor = 'black';
    component.editionService.curentColor = 'white';

    clickElementOf(compiled, fixture, '.save', 'save');

    expect(component.boardService.board.ElementList.length).toBe(1);
    expect(component.boardService.board.ElementList[0].ElementFormsList[0].DisplayedText).toBe('test');
    expect(component.boardService.board.ElementList[0].BorderColor).toBe('black');
    expect(component.boardService.board.ElementList[0].Color).toBe('white');
  });

  it('should add ellement to save', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.currentEditPage = "";

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
          LexicInfos: [{default:true}],
          ImageID: ''}],
        [])],
      [],
      []
    );
    fixture.detectChanges();
    expect(component.boardService.board.ElementList.length).toBe(1);

    component.editionService.selectedElements = [component.boardService.board.ElementList[0]];

    component.editionService.add = false;
    component.editionService.name = 'test';
    component.editionService.curentBorderColor = 'black';
    component.editionService.curentColor = 'white';

    clickElementOf(compiled, fixture, '.save', 'save');

    expect(component.boardService.board.ElementList.length).toBe(1);
    expect(component.boardService.board.ElementList[0].ElementFormsList[0].DisplayedText).toBe('test');
    expect(component.boardService.board.ElementList[0].BorderColor).toBe('black');
    expect(component.boardService.board.ElementList[0].Color).toBe('white');
  });

});
