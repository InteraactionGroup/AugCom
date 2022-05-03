import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoadingUserComponent} from './loading-user.component';
import {Ng2ImgMaxModule} from 'ng2-img-max';

describe('LoadingUserComponent', () => {
  let component: LoadingUserComponent;
  let fixture: ComponentFixture<LoadingUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingUserComponent, Ng2ImgMaxModule]
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
