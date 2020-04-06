import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BackHomeBarComponent} from './back-home-bar.component';

describe('BackHomeBarComponent', () => {
  let component: BackHomeBarComponent;
  let fixture: ComponentFixture<BackHomeBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BackHomeBarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackHomeBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
