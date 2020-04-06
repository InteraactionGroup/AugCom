import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InformationEditionPageComponent} from './information-edition-page.component';

describe('InformationEditionPageComponent', () => {
  let component: InformationEditionPageComponent;
  let fixture: ComponentFixture<InformationEditionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InformationEditionPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationEditionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
