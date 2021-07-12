import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UsertoolbarComponent} from './usertoolbar.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Ng2ImgMaxModule} from 'ng2-img-max';
import {RouterTestingModule} from "@angular/router/testing";

describe('UsertoolbarComponent', () => {
  let component: UsertoolbarComponent;
  let fixture: ComponentFixture<UsertoolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, Ng2ImgMaxModule, RouterTestingModule],
      declarations: [UsertoolbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsertoolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.indexedDBacess.init();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create right buttons in lock mode', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('.button').length).toEqual(2);
    expect(compiled.querySelector('#accountButton')).toBe(null);
    expect(compiled.querySelector('#lockUnlockButton')).not.toBe(null);
    expect(compiled.querySelector('#backButton')).not.toBe(null);
    expect(compiled.querySelector('#editButton')).toBe(null);
    expect(compiled.querySelector('#babbleButton')).toBe(null);
    expect(compiled.querySelector('#fullScreenButton')).toBe(null);
    expect(compiled.querySelector('.buttonLeftLeft')).toBe(null);
    expect(compiled.querySelector('.buttonLeftRight')).toBe(null);
  });

  it('should create right buttons when unlock button clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('#lockUnlockButton').click();
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.button').length).toEqual(8);
    expect(compiled.querySelector('#accountButton')).not.toBe(null);
    expect(compiled.querySelector('#lockUnlockButton')).not.toBe(null);
    expect(compiled.querySelector('#editButton')).not.toBe(null);
    expect(compiled.querySelector('#backButton')).not.toBe(null);
    // expect(compiled.querySelector('#babbleButton')).not.toBe(null);
    // expect(compiled.querySelector('#fullScreenButton')).not.toBe(null);
    expect(compiled.querySelector('.buttonLeftLeft')).not.toBe(null);
    expect(compiled.querySelector('.buttonLeftRight')).not.toBe(null);
  });

  it('should create right buttons when unlock button clicked twice', () => {
    const compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('#lockUnlockButton').click();
    fixture.detectChanges();
    compiled.querySelector('#lockUnlockButton').click();
    fixture.detectChanges();

    expect(compiled.querySelectorAll('.button').length).toEqual(2);
    expect(compiled.querySelector('#accountButton')).toBe(null);
    expect(compiled.querySelector('#lockUnlockButton')).not.toBe(null);
    expect(compiled.querySelector('#backButton')).not.toBe(null);
    expect(compiled.querySelector('#editButton')).toBe(null);
    expect(compiled.querySelector('#babbleButton')).toBe(null);
    expect(compiled.querySelector('#fullScreenButton')).toBe(null);
    expect(compiled.querySelector('.buttonLeftLeft')).toBe(null);
    expect(compiled.querySelector('.buttonLeftRight')).toBe(null);
  });

  it('should enabled edit mode when click on editButton', () => {
    const compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('#lockUnlockButton').click();
    fixture.detectChanges();
    compiled.querySelector('#editButton').click();
    fixture.detectChanges();
    expect((!component.userToolBarService.isConnected || component.userToolBarService.edit)).toBeTruthy();
  });

  it('should open and close babble mode when click on babbleButton', () => {
    const compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('#lockUnlockButton').click();
    fixture.detectChanges();
    compiled.querySelector('#babbleButton').click();
    fixture.detectChanges();
    expect(component.userToolBarService.babble).toBeTruthy();

    compiled.querySelector('#babbleButton').click();
    fixture.detectChanges();
    expect(component.userToolBarService.babble).toBeFalsy();
  });

  it('should open and close search when click on searchButton', () => {
    const compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('#lockUnlockButton').click();
    fixture.detectChanges();
    compiled.querySelector('.buttonLeftRight').click();
    fixture.detectChanges();
    expect(component.userToolBarService.search).toBeTruthy();
    expect(compiled.querySelector('.searchResultContainer')).not.toBe(null);

    compiled.querySelector('.buttonLeftRight').click();
    fixture.detectChanges();
    expect(component.userToolBarService.search).toBeFalsy();
  });

  it('should display different results of the search if they exist', () => {
    const compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('#lockUnlockButton').click();
    fixture.detectChanges();
    compiled.querySelector('.buttonLeftRight').click();
    fixture.detectChanges();
    component.searchService.searchFor('qu');
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.searchResult').length).toBeGreaterThan(0);
  });

  it('should not display any result if none of the element contains the search text', () => {
    const compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('#lockUnlockButton').click();
    fixture.detectChanges();
    compiled.querySelector('.buttonLeftRight').click();
    fixture.detectChanges();
    component.searchService.searchFor('@@@@@@@@');
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.searchResult').length).toEqual(0);
  });

});
