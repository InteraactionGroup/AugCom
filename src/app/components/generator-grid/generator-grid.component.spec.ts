import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratorGridComponent } from './generator-grid.component';

describe('GeneratorGridComponent', () => {
  let component: GeneratorGridComponent;
  let fixture: ComponentFixture<GeneratorGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratorGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratorGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
