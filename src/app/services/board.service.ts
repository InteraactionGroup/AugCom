import { Injectable } from '@angular/core';
import {Board} from '../data/ExempleOfBoard';
import { Element, Grid} from '../types';
import {DomSanitizer} from '@angular/platform-browser';
import {UsertoolbarService} from './usertoolbar.service';
import {EditionService} from './edition.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(public editionService: EditionService, public userToolBarService: UsertoolbarService, public sanitizer: DomSanitizer) {
    this.board  = Board;
    this.sliderValueCol = this.board.gridColsNumber;
    this.sliderValueRow = this.board.gridRowsNumber;
  }

  sliderValueCol;
  sliderValueRow;
  board: Grid;
  currentFolder = '.';

  currentVerbTerminaison: {currentPerson: string, currentNumber: string} = {currentPerson: '', currentNumber: ''};

  currentNounTerminaison: {currentGender: string, currentNumber: string} = {currentGender: '', currentNumber: ''};


  activatedElement = -1;


  resetTerminaisons() {
    this.currentVerbTerminaison = {currentPerson: '', currentNumber: ''};
    this.currentNounTerminaison = {currentGender: '', currentNumber: ''};
  }

  resetVerbTerminaisons() {
    this.currentVerbTerminaison = {currentPerson: '', currentNumber: ''};
  }

  executer() {
    const imageTemp = [];

    this.board.ElementList = this.board.ElementList.filter(x =>
      !x.ElementFolder.startsWith(this.editionService.elementCondamne.ElementFolder + this.editionService.elementCondamne.ElementID));
    this.board.ElementList =  this.board.ElementList.filter(x => x !== this.editionService.elementCondamne );

    this.board.ElementList.forEach(elt => {
      const res = this.board.ImageList.find(img => img.ImageID === elt.ImageID);
      if (res !== null && res !== undefined) {
        imageTemp.push(res);
      }
    });
    this.board.ImageList = imageTemp;
    this.editionService.elementCondamne = null;
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
