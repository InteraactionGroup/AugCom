import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PalettesComponent } from './palettes.component';

describe('PalettesComponent', () => {
  let component: PalettesComponent;
  let fixture: ComponentFixture<PalettesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PalettesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PalettesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
