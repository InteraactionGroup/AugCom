import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextBarComponent } from './textBar.component';

describe('TextBarComponent', () => {
  let component: TextBarComponent;
  let fixture: ComponentFixture<TextBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
