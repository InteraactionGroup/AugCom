import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorOnEditComponent } from './error-on-edit.component';

describe('ErrorOnEditComponent', () => {
  let component: ErrorOnEditComponent;
  let fixture: ComponentFixture<ErrorOnEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorOnEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorOnEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the right message', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.tableTitle').textContent).toContain('Aucun élément à modifier n\'a été selectionné.');
  });
});
