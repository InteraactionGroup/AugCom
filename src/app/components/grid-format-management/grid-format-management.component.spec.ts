import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridFormatManagementComponent } from './grid-format-management.component';

describe('GridFormatManagementComponent', () => {
  let component: GridFormatManagementComponent;
  let fixture: ComponentFixture<GridFormatManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridFormatManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridFormatManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
