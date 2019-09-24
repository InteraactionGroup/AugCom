import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditionPanelComponent } from './edition-panel.component';

describe('EditionPanelComponent', () => {
  let component: EditionPanelComponent;
  let fixture: ComponentFixture<EditionPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditionPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
