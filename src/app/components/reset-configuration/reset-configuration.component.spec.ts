import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetConfigurationComponent } from './reset-configuration.component';

describe('ResetConfigurationComponent', () => {
  let component: ResetConfigurationComponent;
  let fixture: ComponentFixture<ResetConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
