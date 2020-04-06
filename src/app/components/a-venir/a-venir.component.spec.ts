import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AVenirComponent} from './a-venir.component';

describe('AVenirComponent', () => {
  let component: AVenirComponent;
  let fixture: ComponentFixture<AVenirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AVenirComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AVenirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
