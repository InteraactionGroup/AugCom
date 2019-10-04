import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PlayBackClearButtonsComponent} from './play-back-clear-buttons.component';

describe('TextbarComponent', () => {
  let component: PlayBackClearButtonsComponent;
  let fixture: ComponentFixture<PlayBackClearButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayBackClearButtonsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayBackClearButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
