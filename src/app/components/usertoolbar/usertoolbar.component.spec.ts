import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UsertoolbarComponent} from './usertoolbar.component';

describe('UsertoolbarComponent', () => {
  let component: UsertoolbarComponent;
  let fixture: ComponentFixture<UsertoolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsertoolbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsertoolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
