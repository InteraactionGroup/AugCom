import { Injectable } from '@angular/core';
import {Board} from '../data/ExempleOfBoard';
import {Action, Element, Grid, Image, Interaction} from '../types';
import {DomSanitizer} from '@angular/platform-browser';
import {UsertoolbarService} from './usertoolbar.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(public userToolBarService: UsertoolbarService, public sanitizer: DomSanitizer) {
    this.board  = Board;
    // new Grid('grid', [] as Element[], [] as Image[], [] as Action[], [] as Interaction [], 'grid', [] as {ElementType: string, Link: string}[]);
  }

  sliderValue;
  board: Grid;
  currentFolder = '.';


  currentPerson = '';
  currentGender = '';
  currentNumber = '';

  elementCondamne: Element = null;

  activatedElement = -1;


  belongToActiveFolder(element) {
    return true;
  }

  delete(element: Element) {
    this.userToolBarService.popup = true;
    this.elementCondamne = element;
  }
  executer() {
    this.board.ElementList = this.board.ElementList.filter(x => x !== this.elementCondamne);
    this.elementCondamne = null;
  }

  getImgUrl(element: Element) {
    if (this.board.ImageList != null) {
      const path = this.board.ImageList.find(x => x.ImageID === element.ImageID)
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
