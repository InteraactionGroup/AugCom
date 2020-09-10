import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationThemeComponent } from './application-theme.component';

describe('ApplicationThemeComponent', () => {
  let component: ApplicationThemeComponent;
  let fixture: ComponentFixture<ApplicationThemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationThemeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
