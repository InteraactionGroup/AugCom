import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExportSaveDialogComponent} from './export-save-dialog.component';

describe('ExportSaveDialogComponent', () => {
  let component: ExportSaveDialogComponent;
  let fixture: ComponentFixture<ExportSaveDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportSaveDialogComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportSaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
