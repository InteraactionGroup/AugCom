import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TileComponent} from './tile.component';
import {Ng2ImgMaxModule} from 'ng2-img-max';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {GridElement} from '../../types';
import {GridsterModule} from 'angular-gridster2';

describe('TileComponent', () => {
  let component: TileComponent;
  let fixture: ComponentFixture<TileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [TileComponent],
      providers: [{
        provide: Router, useClass: class {
          navigate = jasmine.createSpy('navigate');
        }
      }],
      imports: [Ng2ImgMaxModule, RouterTestingModule, GridsterModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileComponent);
    component = fixture.componentInstance;
    component.element = new GridElement(
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
      [{ID: 'click', ActionList: [{ID: 'display', Action: 'display'}]}]);
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display edit functions ', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.userToolBarService.edit = true;
    component.boardService.currentPath = '#HOME';
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.element').length).toBeGreaterThan(0);
    expect(compiled.querySelectorAll('.deleteElement').length).toBeGreaterThan(0);
    expect(compiled.querySelectorAll('.selectCheckBox').length).toBeGreaterThan(0);
    expect(compiled.querySelectorAll('.elementVisibility').length).toBeGreaterThan(0);
  });

  it('should display home page and its elements', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.boardService.currentPath = '#HOME';
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.element').length).toBeGreaterThan(0);
  });
});
