import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoadingUserComponent} from './loading-user.component';

describe('LoadingUserComponent', () => {
  let component: LoadingUserComponent;
  let fixture: ComponentFixture<LoadingUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingUserComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
