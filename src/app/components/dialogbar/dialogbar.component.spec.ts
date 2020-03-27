import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DialogbarComponent} from './dialogbar.component';

describe('DialogbarComponent', () => {
  let component: DialogbarComponent;
  let fixture: ComponentFixture<DialogbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
