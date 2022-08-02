import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseYourGridComponent } from './choose-your-grid.component';

describe('ChooseYourGridComponent', () => {
  let component: ChooseYourGridComponent;
  let fixture: ComponentFixture<ChooseYourGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseYourGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseYourGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
