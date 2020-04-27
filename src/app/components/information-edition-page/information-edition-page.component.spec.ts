import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InformationEditionPageComponent} from './information-edition-page.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

describe('InformationEditionPageComponent', () => {
  let component: InformationEditionPageComponent;
  let fixture: ComponentFixture<InformationEditionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, HttpClientModule],
      declarations: [InformationEditionPageComponent]
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
    expect(compiled.querySelectorAll('.label').item(0).textContent).toContain("Nom de l'élément:");
    expect(compiled.querySelectorAll('.label').item(1).textContent).toContain("Type d'élément :");
  });


});
