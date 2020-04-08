import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ImageSelectionPageComponent} from './image-selection-page.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";

describe('ImageSelectionPageComponent', () => {
  let component: ImageSelectionPageComponent;
  let fixture: ComponentFixture<ImageSelectionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      declarations: [ImageSelectionPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSelectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
