import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {


  interactionIDs = [
    {id:'click',plus:false,actionList:['display',
        'say',]},
    {id:'longPress',plus:false,actionList:['say']},
    {id:'doubleClick',plus:false,actionList:['otherforms']}];

  functionList: string[] = [];
  selectedFunction = '@';

  constructor() {
    this.initFunctionList();
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

  selectFunction(interId: {id:string,plus:boolean,actionList:string[]} , p:string){
    console.log(p);
    interId.actionList.push(p);
  }

  selectFunction2(interId: {id:string,plus:boolean,actionList:string[]}){
    console.log(this.selectedFunction);
    interId.actionList.push(this.selectedFunction);
    interId.plus = false;
    this.selectedFunction = '@'
  }

}
