import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogbarComponent} from './dialogbar.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Ng2ImgMaxModule} from 'ng2-img-max';
import {Vignette} from '../../types';
import {MatDialogModule} from "@angular/material/dialog";
import {Router} from "@angular/router";

function addVignette(component: any) {
  component.historicService.historic.push(new Vignette());
}

describe('DialogbarComponent', () => {
  let component: DialogbarComponent;
  let fixture: ComponentFixture<DialogbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, Ng2ImgMaxModule, MatDialogModule ],
      declarations: [DialogbarComponent],
      providers: [{
        provide: Router, useClass: class {
          navigate = jasmine.createSpy('navigate');
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display good number of vignettes', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.historicService.historic = [];
    addVignette(component);
    addVignette(component);
    addVignette(component);
    fixture.detectChanges();
    expect(compiled.querySelectorAll('.element').length).toEqual(3);
  });

  it('should remove one vignette when back is clicked', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.historicService.historic = [];
    addVignette(component);
    addVignette(component);
    addVignette(component);
    fixture.detectChanges();
    compiled.querySelectorAll('.button').item(1).click();
    fixture.detectChanges();
    expect(component.historicService.historic.length).toEqual(3);
    expect(compiled.querySelectorAll('.element').length).toEqual(3);
  });

  it('should clear the dialog bar by removing all the vignettes', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.historicService.historic = [];
    addVignette(component);
    addVignette(component);
    addVignette(component);
    fixture.detectChanges();
    compiled.querySelectorAll('.button').item(3).click();
    fixture.detectChanges();
    expect(component.historicService.historic.length).toEqual(0);
    expect(compiled.querySelectorAll('.element').length).toEqual(0);
  });

});
