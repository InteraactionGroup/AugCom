import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsComponent} from './settings.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from "@angular/common/http";

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, HttpClientModule],
      declarations: [SettingsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain input for longPress', () => {
    const compiled = fixture.debugElement.nativeElement;
    const longPressInput = compiled.querySelector('#longPressTime');
    expect(longPressInput).not.toBe(null);
  });

  it('should contain input for doubleClick', () => {
    const compiled = fixture.debugElement.nativeElement;
    const doubleClickInput = compiled.querySelector('#doubleClickTime');
    expect(doubleClickInput).not.toBe(null);
  });

});
