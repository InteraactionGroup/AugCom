import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountComponent} from './account.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      declarations: [AccountComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain proper title', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.menu-title-container').firstChild.textContent).toContain('Paramètres');
  });

  it('should contain proper titles in menu', () => {
    const compiled = fixture.debugElement.nativeElement;
    const menuString = compiled.querySelector('.menu-item-title-container').parentElement.parentElement.parentElement.textContent;
    component.menu.forEach( submenu => {
      expect(menuString).toContain(submenu[0]);
      submenu[1].forEach( item => {
        expect(menuString).toContain(item);
      })
    });
  });

  it('should create menu and submenu', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('app-saves')).toBeTruthy();
    expect(compiled.querySelectorAll('app-language')).toBeTruthy();
    expect(compiled.querySelectorAll('app-palettes')).toBeTruthy();
    expect(compiled.querySelectorAll('app-share')).toBeTruthy();
    expect(compiled.querySelectorAll('app-settings')).toBeTruthy();
  });

  it('should select good menu and submenu', () => {
    const compiled = fixture.debugElement.nativeElement;

    component.selectedMenu = '';
    component.selectedSubMenu = '';

    component.selectMenu('Langue');
    expect(component.selectedMenu).toEqual('Langue');
    expect(component.selectedSubMenu).toEqual('');

    component.selectMenu('Compte');
    expect(component.selectedMenu).toEqual('Compte');
    expect(component.selectedSubMenu).toEqual('Informations du compte');
  });

});
