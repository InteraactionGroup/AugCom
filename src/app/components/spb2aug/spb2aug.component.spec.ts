import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Spb2augComponent } from './spb2aug.component';

describe('Spb2augComponent', () => {
  let component: Spb2augComponent;
  let fixture: ComponentFixture<Spb2augComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Spb2augComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Spb2augComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
