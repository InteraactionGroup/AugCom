import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SavesComponent} from './saves.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Ng2ImgMaxModule} from 'ng2-img-max';
import {GridElement} from '../../types';
import {Board} from '../../data/ExempleOfBoard';
import {Router} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";

describe('SavesComponent', () => {
  let component: SavesComponent;
  let fixture: ComponentFixture<SavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, Ng2ImgMaxModule, HttpClientModule],
      declarations: [SavesComponent],
      providers: [{
        provide: Router, useClass: class {
          navigate = jasmine.createSpy('navigate');
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.indexeddbaccessService.loadUsersList();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should revert save to default value', () => {
    const compiled = fixture.debugElement.nativeElement;
    const prevLength = component.boardService.board.ElementList.length;
    component.boardService.board.ElementList.push(new GridElement(
      '',
      '',
      '',
      '',
      '',
      0,
      [],
      []));

    expect(component.boardService.board.ElementList.length).toEqual(prevLength + 1);
    fixture.detectChanges();

    component.boardService.board = null;
    compiled.querySelector('#resetButton').click();
    fixture.detectChanges();

    expect(component.boardService.board.ElementList.length).toEqual(Board.ElementList.length);
  });


});
