import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoadingUserComponent} from './loading-user.component';
import {Ng2ImgMaxModule} from 'ng2-img-max';
import {RouterTestingModule} from '@angular/router/testing';

describe('LoadingUserComponent', () => {
  let component: LoadingUserComponent;
  let fixture: ComponentFixture<LoadingUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingUserComponent],
      imports: [Ng2ImgMaxModule, RouterTestingModule]
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
