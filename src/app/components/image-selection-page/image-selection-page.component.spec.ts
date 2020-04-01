import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSelectionPageComponent } from './image-selection-page.component';

describe('ImageSelectionPageComponent', () => {
  let component: ImageSelectionPageComponent;
  let fixture: ComponentFixture<ImageSelectionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSelectionPageComponent ]
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
