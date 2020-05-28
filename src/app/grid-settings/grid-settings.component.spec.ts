import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSettingsComponent } from './grid-settings.component';

describe('GridSettingsComponent', () => {
  let component: GridSettingsComponent;
  let fixture: ComponentFixture<GridSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
