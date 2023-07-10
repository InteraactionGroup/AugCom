import { Injectable } from '@angular/core';
import { Action } from '../types';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  interactionIDs: { ID: string, plus: boolean, ActionList: Action[] }[] = [
    { ID: 'click', plus: false, ActionList: [] },
    { ID: 'longPress', plus: false, ActionList: [] },
    { ID: 'doubleClick', plus: false, ActionList: [] }];

  functionList: string[] = [];
  selectedFunction = '@';

  constructor() {
    this.initFunctionList();
    this.reset();
  }

  /**
   * Resets the interactions of the selected elements
   */
  reset() {
    this.interactionIDs = [
      { ID: 'click', plus: false, ActionList: [] },
      { ID: 'longPress', plus: false, ActionList: [] },
      { ID: 'doubleClick', plus: false, ActionList: [] }];
  }

  /**
   * Initializes all available interactions of the selected element(s)
   */
  initFunctionList() {
    this.functionList.push(
      'display',
      'say',
      'otherforms',
      'back',
      'backHome',
    )
  }

/**
 * Selects an interaction and adds it to the action list
 * @param interId interaction to be selected
 */
  selectFunction2(interId: { ID: string, plus: boolean, ActionList: Action[] }) {
    interId.ActionList.push({ ID: this.selectedFunction, Options: [] });
    interId.plus = false;
    this.selectedFunction = '@'
  }

}
