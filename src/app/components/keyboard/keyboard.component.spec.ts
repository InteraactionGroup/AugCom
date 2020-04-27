import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {KeyboardComponent} from './keyboard.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {DragulaModule} from "ng2-dragula";
import {Ng2ImgMaxModule} from "ng2-img-max";
import {Router} from "@angular/router";

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

  it('should display home page and its elements but no back button', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.boardService.currentPath='#HOME';
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.element').length).toBeGreaterThan(0);
    expect(compiled.querySelector('#backButton')).toBe(null);
    expect(compiled.querySelector('.add')).toBe(null);
    expect(compiled.querySelector('.editionSettings')).toBe(null);
  });

  it('should display backButton if we are not on the home page', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.boardService.currentPath='#HOME.otherPage';
    fixture.detectChanges();
    expect(compiled.querySelector('#backButton')).not.toBe(null);
    expect(compiled.querySelector('.add')).toBe(null);
    expect(compiled.querySelector('.editionSettings')).toBe(null);
  });

  it('should display edit functions ', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.userToolBarService.edit = true;
    component.boardService.currentPath='#HOME';
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.element').length).toBeGreaterThan(0);
    expect(compiled.querySelector('#backButton')).toBe(null);
    expect(compiled.querySelector('.add')).not.toBe(null);
    expect(compiled.querySelector('.editionSettings')).not.toBe(null);
  });

});
