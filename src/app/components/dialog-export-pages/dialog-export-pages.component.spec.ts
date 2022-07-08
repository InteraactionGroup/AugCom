import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogExportPagesComponent } from './dialog-export-pages.component';

describe('DialogExportPagesComponent', () => {
  let component: DialogExportPagesComponent;
  let fixture: ComponentFixture<DialogExportPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogExportPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogExportPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
