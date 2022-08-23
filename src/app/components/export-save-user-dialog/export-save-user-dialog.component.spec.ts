import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportSaveUserDialogComponent } from './export-save-user-dialog.component';

describe('XportSaveUserDialogComponent', () => {
  let component: ExportSaveUserDialogComponent;
  let fixture: ComponentFixture<ExportSaveUserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportSaveUserDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportSaveUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
