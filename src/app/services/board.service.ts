import { Injectable } from '@angular/core';
import {Board} from '../data/ExempleOfBoard';
import {Action, Element, Grid, Image} from '../types';
import {DomSanitizer} from '@angular/platform-browser';
import {UsertoolbarService} from './usertoolbar.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(public userToolBarService: UsertoolbarService, public sanitizer: DomSanitizer) {
    this.board  = Board;
    this.sliderValueCol = this.board.gridColsNumber;
    this.sliderValueRow = this.board.gridRowsNumber;
    // new Grid('grid', [] as Element[], [] as Image[], [] as Action[], [] as Interaction [], 'grid', [] as {ElementType: string, Link: string}[]);
  }

  sliderValueCol;
  sliderValueRow;
  board: Grid;
  currentFolder = '.';

  currentVerbTerminaison: {currentPerson: string, currentNumber: string} = {currentPerson: '', currentNumber: ''};

  currentNounTerminaison: {currentGender: string, currentNumber: string} = {currentGender: '', currentNumber: ''};

  elementCondamne: Element = null;

  activatedElement = -1;

  selectedElementsList = [];

  selectAll = false;


  selectAllElements() {
    this.selectedElementsList = [];
    if (!this.selectAll) {
      this.board.ElementList.forEach(elt => this.add(elt));
    }
    this.selectAll = !this.selectAll;
  }

  belongToActiveFolder(element) {
    return true;
  }

  add(element: Element) {
    if (!this.selectedElementsList.includes(element)) {
      this.selectedElementsList.push(element);
    }
  }

  select(element: Element) {
    if (this.selectedElementsList.includes(element)) {
      this.selectedElementsList = this.selectedElementsList.filter(elt => elt !== element);
      this.selectAll = false;
    } else {
      this.selectedElementsList.push(element);
    }
  }

  isSelected(element: Element) {
    return this.selectedElementsList.includes(element);
  }

  delete(element: Element) {
    this.userToolBarService.popup = true;
    this.elementCondamne = element;
  }

  resetTerminaisons() {
    this.currentVerbTerminaison = {currentPerson: '', currentNumber: ''};
    this.currentNounTerminaison = {currentGender: '', currentNumber: ''};
  }

  resetVerbTerminaisons() {
    this.currentVerbTerminaison = {currentPerson: '', currentNumber: ''};
  }

  executer() {
    const imageTemp = [];

    this.board.ElementList = this.board.ElementList.filter(x => !x.ElementFolder.startsWith(this.elementCondamne.ElementFolder + this.elementCondamne.ElementID));
    this.board.ElementList =  this.board.ElementList.filter(x => x !== this.elementCondamne );

    this.board.ElementList.forEach(elt => {
      const res = this.board.ImageList.find(img => img.ImageID === elt.ImageID);
      if (res !== null && res !== undefined) {
        imageTemp.push(res);
      }
    });
    this.board.ImageList = imageTemp;
    this.elementCondamne = null;
  }

  getImgUrl(element: Element) {
    if (this.board.ImageList != null) {
      const path = this.board.ImageList.find(x => x.ImageID === element.ImageID);
      if (path !== null && path !== undefined) {
        const s = path.ImagePath;
        return this.sanitizer.bypassSecurityTrustStyle('url(' + s + ')');
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  elementColor(element: Element) {
   // return element.ElementType === 'button' ? 'greenyellow' : ('folder' ? 'orange' : 'red');
    return element.Color;
  }

  backToPreviousFolder() {
    const path = this.currentFolder.split('.');
    let temp = '';
    path.slice(0, path.length - 1).forEach( value =>
      temp = '.' + value
    ) ;
    this.currentFolder = temp;
  }
}
