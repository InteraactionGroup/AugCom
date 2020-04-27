import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ImageSelectionPageComponent} from './image-selection-page.component';
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Ng2ImgMaxModule} from "ng2-img-max";

describe('ImageSelectionPageComponent', () => {
  let component: ImageSelectionPageComponent;
  let fixture: ComponentFixture<ImageSelectionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, Ng2ImgMaxModule],
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

  it('should change the image from url', () => {
    const compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('#imagefromURL').value = "https://images.freeimages.com/images/large-previews/e12/corn-field-1-1368931.jpg";
    compiled.querySelector('.searchURL').click();
    expect(component.editionService.imageURL).toEqual("https://images.freeimages.com/images/large-previews/e12/corn-field-1-1368931.jpg");
  });

  it('should change the image from mulberry', () => {
    const compiled = fixture.debugElement.nativeElement;
    compiled.querySelector('#imagefromLib').value = "dog";
    compiled.querySelector('.searchLib').click();
    fixture.detectChanges();
    compiled.querySelector('.pictoImg').click();
    expect(component.editionService.imageURL).toContain("dog");
  });

});
