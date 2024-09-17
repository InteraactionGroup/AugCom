import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Spb2augUpgradeComponent } from './spb2aug-upgrade.component';

describe('Spb2augUpgradeComponent', () => {
  let component: Spb2augUpgradeComponent;
  let fixture: ComponentFixture<Spb2augUpgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Spb2augUpgradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Spb2augUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
