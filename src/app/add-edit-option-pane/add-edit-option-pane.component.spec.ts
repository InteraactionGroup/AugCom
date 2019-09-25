import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditOptionPaneComponent } from './add-edit-option-pane.component';

describe('AddEditOptionPaneComponent', () => {
  let component: AddEditOptionPaneComponent;
  let fixture: ComponentFixture<AddEditOptionPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditOptionPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditOptionPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
