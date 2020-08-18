import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EventComponent} from './event.component';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';

describe('EventComponent', () => {
  let component: EventComponent;
  let fixture: ComponentFixture<EventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      declarations: [EventComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add create all the actions clicked and the associated interactions', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.editionService.interractionList = [];

    const actionID = ['display', 'say', 'otherforms'];
    const interactionID = ['click', 'longPress', 'doubleClick'];

    interactionID.forEach(interaction => {
      expect(component.editionService.interractionList.findIndex(i => {
        return i.ID === interaction
      })).toBe(-1);
      component.editionService.interractionList.forEach(interactionElement => {
        actionID.forEach(action => {
          expect(interactionElement.ActionList.findIndex(actionOfInteraction => {
            return actionOfInteraction.ID === action
          })).toBe(-1);
        })
      })
    });

    compiled.querySelectorAll('.event').forEach(element => {
      element.click();
    });

    interactionID.forEach(interaction => {
      expect(component.editionService.interractionList.findIndex(i => {
        return i.ID === interaction
      })).not.toBe(-1);
      component.editionService.interractionList.forEach(interactionElement => {
        actionID.forEach(action => {
          expect(interactionElement.ActionList.findIndex(actionOfInteraction => {
            return actionOfInteraction.ID === action
          })).not.toBe(-1);
        })
      })
    });

  });

});
