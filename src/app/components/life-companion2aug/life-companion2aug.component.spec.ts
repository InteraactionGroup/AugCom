import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeCompanion2augComponent } from './life-companion2aug.component';

describe('LifeCompanion2augComponent', () => {
  let component: LifeCompanion2augComponent;
  let fixture: ComponentFixture<LifeCompanion2augComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeCompanion2augComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeCompanion2augComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
