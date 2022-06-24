import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelGridComponent } from './model-grid.component';

describe('ModelPageComponent', () => {
  let component: ModelGridComponent;
  let fixture: ComponentFixture<ModelGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
