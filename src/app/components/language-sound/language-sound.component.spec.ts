import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LanguageSoundComponent} from './language-sound.component';

describe('LanguageSoundComponent', () => {
  let component: LanguageSoundComponent;
  let fixture: ComponentFixture<LanguageSoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LanguageSoundComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
