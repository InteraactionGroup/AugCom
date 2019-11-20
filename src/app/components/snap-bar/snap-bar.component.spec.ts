import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapBarComponent } from './snap-bar.component';

describe('SnapBarComponent', () => {
  let component: SnapBarComponent;
  let fixture: ComponentFixture<SnapBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnapBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnapBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
