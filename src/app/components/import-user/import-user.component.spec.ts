import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportUserComponent } from './import-user.component';

describe('ImportUserComponent', () => {
  let component: ImportUserComponent;
  let fixture: ComponentFixture<ImportUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
