import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationEditionPageComponent } from './information-edition-page.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { Router } from "@angular/router";

describe('InformationEditionPageComponent', () => {
  let component: InformationEditionPageComponent;
  let fixture: ComponentFixture<InformationEditionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, HttpClientModule, Ng2ImgMaxModule],
      declarations: [InformationEditionPageComponent],
      providers: [{
        provide: Router, useClass: class {
          navigate = jasmine.createSpy('navigate');
        }
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationEditionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display right labels', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('.label').item(0).textContent).toContain(component.multilinguism.translate('elementName'));
    expect(compiled.querySelectorAll('.label').item(1).textContent).toContain(component.multilinguism.translate('elementType'));
  });


});
