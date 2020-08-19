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

    expect(compiled.querySelectorAll('.buttonAdd').length).toEqual(3);

    // TODO : find a way to test the new way it's done

    let addTemp = 0;
    compiled.querySelectorAll('.buttonAdd').forEach(add => {
      add.click();
      fixture.detectChanges();

      expect(compiled.querySelectorAll('.selectBox').length).toEqual(1);

      component.functionService.selectedFunction = (compiled.querySelector('.selectBox') as HTMLSelectElement).options[1].value;
        fixture.detectChanges();
        component.functionService.selectFunction2(component.functionService.interactionIDs[0]);
        fixture.detectChanges();
        expect(component.functionService.interactionIDs[0].ActionList.length).toBeGreaterThan(0);
        expect(component.functionService.interactionIDs[0].ActionList[0].ID).toEqual(component.functionService.functionList[0]);
      addTemp++;
    });


    // interactionID.forEach(interaction => {
    //   expect(component.editionService.interractionList.findIndex(i => {
    //     return i.ID === interaction
    //   })).not.toBe(-1);
    //   component.editionService.interractionList.forEach(interactionElement => {
    //     actionID.forEach(action => {
    //       expect(interactionElement.ActionList.findIndex(actionOfInteraction => {
    //         return actionOfInteraction.ID === action
    //       })).not.toBe(-1);
    //     })
    //   })
    // });

  });

});
