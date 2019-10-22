import { Injectable } from '@angular/core';
import {Board} from '../data/ExempleOfBoard';
import {Element} from '../types';
import {DomSanitizer} from '@angular/platform-browser';
import {UsertoolbarService} from './usertoolbar.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor( private userToolBarService: UsertoolbarService, private sanitizer: DomSanitizer) { }

  board = Board;
  currentFolder = '.';

  elementCondamne: Element = null;


  getTempList() {
    return this.board.ElementList.filter(elt =>  {
      return this.currentFolder === elt.ElementFolder;
    });
  }

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
      const s = this.board.ImageList.find(x => x.ImageID === element.ImageID).ImagePath;
      return this.sanitizer.bypassSecurityTrustStyle('url(' + s + ')');
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
