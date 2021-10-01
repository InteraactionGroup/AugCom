import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModifyColorInsideComponent } from './dialog-modify-color-inside.component';

describe('DialogImageSelectionPageComponent', () => {
  let component: DialogModifyColorInsideComponent;
  let fixture: ComponentFixture<DialogModifyColorInsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogModifyColorInsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModifyColorInsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
