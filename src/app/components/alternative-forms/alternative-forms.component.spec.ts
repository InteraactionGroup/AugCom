import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternativeFormsComponent } from './alternative-forms.component';

describe('AlternativeFormsComponent', () => {
  let component: AlternativeFormsComponent;
  let fixture: ComponentFixture<AlternativeFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlternativeFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlternativeFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
