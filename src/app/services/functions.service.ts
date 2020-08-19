import { Injectable } from '@angular/core';
import {Action} from '../types';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {


  interactionIDs: {ID: string, plus: boolean, ActionList: Action[]}[] = [
    {ID:'click',plus:false,ActionList:[]},
    {ID:'longPress',plus:false,ActionList:[]},
    {ID:'doubleClick',plus:false,ActionList:[]}];

  functionList: string[] = [];
  selectedFunction = '@';

  constructor() {
    this.initFunctionList();
    this.reset();
  }

  reset(){
    this.interactionIDs = [
      {ID:'click',plus:false,ActionList:[]},
      {ID:'longPress',plus:false,ActionList:[]},
      {ID:'doubleClick',plus:false,ActionList:[]}];
  }

  initFunctionList(){
    this.functionList.push(
      'display',
      'say',
      'otherforms',
      'backToPreviousPage',
      'backHome',
      'changeGenre',
      'changeNumber',
      'changePerson',
      'changeTime',
      'changeLevel')
  }


  selectFunction2(interId: {ID:string,plus:boolean,ActionList:Action[]}){
    console.log(this.selectedFunction);
    interId.ActionList.push({ID: this.selectedFunction, Options :[]});
    interId.plus = false;
    this.selectedFunction = '@'
  }

}
