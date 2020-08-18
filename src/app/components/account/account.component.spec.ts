import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AccountComponent} from './account.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Ng2ImgMaxModule} from 'ng2-img-max';

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
  const tabNameList = ['app-saves', 'app-language', 'app-palettes', 'app-share', 'app-settings'];
  tabNameList.forEach(tabName => {
    if (tabName === openElementName) {
      expect(compiled.querySelector(tabName)).not.toBe(null);
    } else {
      expect(compiled.querySelector(tabName)).toBe(null);
    }
  });
}

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, Ng2ImgMaxModule],
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
    expect(compiled.querySelector('.menu-title-container').firstChild.textContent).toContain(component.multilinguism.translate('settings'));
  });

  it('should contain proper titles in menu', () => {
    const compiled = fixture.debugElement.nativeElement;
    const menuString = compiled.querySelector('.menu-item-title-container').parentElement.parentElement.parentElement.textContent;
    component.menu.forEach(submenu => {
      expect(menuString).toContain(component.multilinguism.translate(submenu[0]));
      submenu[1].forEach(item => {
        expect(menuString).toContain(component.multilinguism.translate(item));
      })
    });
  });

  it('should display app-saves when Gestion des sauvegardes is selected', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.selectSubMenu('account', 'saveManagement');
    fixture.detectChanges();
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled, 'app-saves');
  });

  it('should display app-language when Langue is selected', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.selectSubMenu('language', '');
    fixture.detectChanges();
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled, 'app-language');
  });

  it('should display app-palettes when Gestion des palettes is selected', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.selectSubMenu('appearance', 'paletteManagement');
    fixture.detectChanges();
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled, 'app-palettes');
  });

  it('should display app-share when Partager is selected', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.selectSubMenu('share', '');
    fixture.detectChanges();
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled, 'app-share');
  });

  it('should display app-settings when Paramètres is selected', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.selectSubMenu('settings', '');
    fixture.detectChanges();
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled, 'app-settings');
  });

  it('should display app-saves when Gestion des sauvegardes is clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    clickElementOf(compiled, fixture, '.menu-item-title-container', component.multilinguism.translate('account'));
    clickElementOf(compiled, fixture, '.sub-menu-item-title-container', component.multilinguism.translate('saveManagement'));
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled, 'app-saves');
  });

  it('should display app-language when Langue is clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    clickElementOf(compiled, fixture, '.menu-item-title-container', component.multilinguism.translate('language'));
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled, 'app-language');
  });

  it('should display app-palettes when Gestion des palettes is clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    clickElementOf(compiled, fixture, '.menu-item-title-container', component.multilinguism.translate('appearance'));
    clickElementOf(compiled, fixture, '.sub-menu-item-title-container', component.multilinguism.translate('paletteManagement'));
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled, 'app-palettes');
  });

  it('should display app-share when Partager is clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    clickElementOf(compiled, fixture, '.menu-item-title-container', component.multilinguism.translate('share'));
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled, 'app-share');
  });

  it('should display app-settings when Paramètres is clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    clickElementOf(compiled, fixture, '.menu-item-title-container', component.multilinguism.translate('settings'));
    expectThisTabToBeTheOnlyOpenTabOfCompiled(compiled, 'app-settings');
  });

  it('should select good menu empty submenu for a menu having no submenu', () => {
    component.selectMenu('language');
    expect(component.selectedMenu).toEqual('language');
    expect(component.selectedSubMenu).toEqual('');
  });

  it('should select good menu and first submenu for a menu having submenus', () => {
    component.selectMenu('account');
    expect(component.selectedMenu).toEqual('account');
    expect(component.selectedSubMenu).toEqual('accountInfo');
  });

  it('should select good menu and first submenu for a click on a menu having no submenu', () => {
    const compiled = fixture.debugElement.nativeElement;
    clickElementOf(compiled, fixture, '.menu-item-title-container', component.multilinguism.translate('language'));
    expect(component.selectedMenu).toEqual('language');
    expect(component.selectedSubMenu).toEqual('');
  });

  it('should select good menu and first submenu for a click on a menu having submenus', () => {
    const compiled = fixture.debugElement.nativeElement;
    clickElementOf(compiled, fixture, '.menu-item-title-container', component.multilinguism.translate('account'));
    expect(component.selectedMenu).toEqual('account');
    expect(component.selectedSubMenu).toEqual('accountInfo');
  });

});
