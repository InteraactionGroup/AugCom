import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {KeyboardComponent} from './keyboard.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {DragulaModule} from "ng2-dragula";
import {Ng2ImgMaxModule} from "ng2-img-max";
import {Router} from "@angular/router";
import {Grid, GridElement} from "../../types";

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
        LexicInfos: [{default: true}],
        ImageID: ''
      }],
      [{ID: 'click', ActionList: [{ID: 'display', Action: 'display'}]}])],
    [],
    []
  );
}

describe('KeyboardComponent', () => {
  let component: KeyboardComponent;
  let fixture: ComponentFixture<KeyboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, DragulaModule, Ng2ImgMaxModule],
      providers: [ { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); } }],
      declarations: [KeyboardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.indexeddbaccessService.init();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create subcomponents', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('app-snap-bar')).not.toBe(null);
    expect(compiled.querySelectorAll('app-usertoolbar')).not.toBe(null);
    expect(compiled.querySelectorAll('app-dialogbar')).not.toBe(null);
  });

  it('should display home page and its elements', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.boardService.currentPath='#HOME';
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.element').length).toBeGreaterThan(0);
    expect(compiled.querySelector('.add')).toBe(null);
    expect(compiled.querySelector('.editionSettings')).toBe(null);
  });

  it('should display edit functions ', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.userToolBarService.edit = true;
    component.boardService.currentPath='#HOME';
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.element').length).toBeGreaterThan(0);
    expect(compiled.querySelectorAll('.deleteElement').length).toBeGreaterThan(0);
    expect(compiled.querySelectorAll('.selectCheckBox').length).toBeGreaterThan(0);
    expect(compiled.querySelectorAll('.elementVisibility').length).toBeGreaterThan(0);
    expect(compiled.querySelector('.add')).not.toBe(null);
    expect(compiled.querySelector('.editionSettings')).not.toBe(null);
  });

  it('should add clicked element having display action on click to historic', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.boardService.currentPath='#HOME';
    fixture.detectChanges();
    component.action(component.boardService.board.ElementList[0], 'click');
    fixture.detectChanges();
    expect(component.historicService.historic.length).toBeGreaterThan(0);
    component.action(component.boardService.board.ElementList[0], 'click');
    fixture.detectChanges();
    expect(component.historicService.historic.length).toBeGreaterThan(1);
  });

});
