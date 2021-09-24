import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModifyColorBorderComponent } from './dialog-modify-color-border.component';

describe('DialogModifyColorBorderComponent', () => {
  let component: DialogModifyColorBorderComponent;
  let fixture: ComponentFixture<DialogModifyColorBorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogModifyColorBorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModifyColorBorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
