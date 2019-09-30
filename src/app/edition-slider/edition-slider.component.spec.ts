import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditionSliderComponent} from './edition-slider.component';

describe('EditionSliderComponent', () => {
  let component: EditionSliderComponent;
  let fixture: ComponentFixture<EditionSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditionSliderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
