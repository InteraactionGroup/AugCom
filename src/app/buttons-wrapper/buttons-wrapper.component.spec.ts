import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonsWrapperComponent} from './buttons-wrapper.component';

describe('ButtonsWrapperComponent', () => {
  let component: ButtonsWrapperComponent;
  let fixture: ComponentFixture<ButtonsWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonsWrapperComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
