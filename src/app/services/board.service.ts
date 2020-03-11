import {Injectable} from '@angular/core';
import {Board} from '../data/ExempleOfBoard';
import {Element, ElementForm, Grid} from '../types';
import {DomSanitizer} from '@angular/platform-browser';
import {UsertoolbarService} from './usertoolbar.service';
import {EditionService} from './edition.service';
import {Ng2ImgMaxService} from 'ng2-img-max';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(public ng2ImgMaxService: Ng2ImgMaxService, public editionService: EditionService, public userToolBarService: UsertoolbarService, public sanitizer: DomSanitizer) {
    this.board = Board;
    this.sliderValueCol = this.board.gridColsNumber;
    this.sliderValueRow = this.board.gridRowsNumber;
  }

  background: any = '';

  sliderValueCol;
  sliderValueRow;
  board: Grid;
  currentFolder = '.';

  currentVerbTerminaison: { currentPerson: string, currentNumber: string } = {currentPerson: '', currentNumber: ''};

  currentNounTerminaison: { currentGender: string, currentNumber: string } = {currentGender: '', currentNumber: ''};


  activatedElement = -1;


  resetBoard() {
    this.board = Board;
  }

  updateBackground(file) {
    const reader = new FileReader();
    this.ng2ImgMaxService.resize([file[0]], 1000, 1000).subscribe(result => {
      reader.readAsDataURL(result);
      reader.onload = () => {
        this.background = 'url(' + reader.result + ')';
      };
    });
  }

  /**
   * return the current label of the element dependind on the current noun and verb termination
   * @param element, an Element
   * @return return the current label of the element
   */
  getLabel(element: Element) {

    if (element.ElementPartOfSpeech === '-verb-') {
      const verbElement = element.ElementForms.find(elt => this.checkVerbForms(elt));
      if (verbElement != null) {
        return verbElement.DisplayedText;
      }
    }

    if (element.ElementPartOfSpeech === '-nom-' || element.ElementPartOfSpeech === '-adj-') {
      const nounElement = element.ElementForms.find(elt => this.checkNounForms(elt));
      if (nounElement != null) {
        return nounElement.DisplayedText;
      }
    }
    const defaultElement = element.ElementForms.find(elt => this.checkDefault(elt));
    if (defaultElement != null) {
      return defaultElement.DisplayedText;
    } else {
      if (element.ElementForms.length > 0) {
        return element.ElementForms[0].DisplayedText;
      } else {
        return '';
      }
    }
  }

  /**
   * check if 'elt' person and number information correspond to current person and number of current verb Termination
   * @param elt, a list of element forms
   * @return true if elt person and number information correspond to current person and number of current verb Termination
   */
  checkVerbForms(elt: ElementForm): boolean {
    let person = false;
    let n = false;
    elt.LexicInfos.forEach(info => {
      if (!person && info.person != null
        && info.person === this.currentVerbTerminaison.currentPerson) {
        person = true;
      }

      if (!n && info.number != null
        && info.number === this.currentVerbTerminaison.currentNumber) {
        n = true;
      }
    });
    return person && n;
  }

  /**
   * check if 'elt' gender and number information correspond to current gender and number of current Noun Termination
   * @param elt, a list of element forms
   * @return true if elt gender and number information correspond to current gender and number of current Noun Termination
   */
  checkNounForms(elt: ElementForm): boolean {
    let gender = this.currentNounTerminaison.currentGender === '' ||
      elt.LexicInfos.find(info => info.gender != null && info.gender !== undefined) === undefined;
    let n = false;
    elt.LexicInfos.forEach(info => {
      if (!gender && info.gender != null
        && info.gender === this.currentNounTerminaison.currentGender) {

        gender = true;
      }

      if (!n && info.number != null
        && info.number === this.currentNounTerminaison.currentNumber) {
        n = true;
      }
    });
    return gender && n;
  }

  /**
   * check if the element form list 'elt' contains a default value
   * @param elt, a list of element forms
   * @return true if elt contains a default form, false otherwise
   */
  checkDefault(elt: ElementForm): boolean {
    let defaultVal = false;
    elt.LexicInfos.forEach(info => {
      if (info.default != null
        && info.default === true) {
        defaultVal = true;
      }
    });
    return defaultVal;
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

    this.board.ElementList = this.board.ElementList.filter(x => {
        let isChildrenOfCondamnedElt = false;
        this.editionService.elementCondamne.forEach(condamnedElt => {
          isChildrenOfCondamnedElt = isChildrenOfCondamnedElt ||
            x.ElementFolder.startsWith(condamnedElt.ElementFolder + condamnedElt.ElementID);
        });
        return !isChildrenOfCondamnedElt;
      }
    );

    this.board.ElementList = this.board.ElementList.filter(x => {
      let isCondamned = false;
      this.editionService.elementCondamne.forEach(condamnedElt => {
        isCondamned = isCondamned || x === condamnedElt;
      });
      return !isCondamned;
    });

    this.board.ElementList.forEach(elt => {
      const res = this.board.ImageList.find(img => img.ImageID === elt.ImageID);
      if (res !== null && res !== undefined) {
        imageTemp.push(res);
      }
    });
    this.board.ImageList = imageTemp;
    this.editionService.elementCondamne = [];

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

  getSimpleImgUrl(element: Element) {
    if (this.board.ImageList != null) {
      const path = this.board.ImageList.find(x => x.ImageID === element.ImageID);
      if (path !== null && path !== undefined) {
        const s = path.ImagePath;
        return 'url(' + s + ')';
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
    const newPath = path.slice(0, path.length - 1);
    console.log(newPath);
    let index = 0;
    newPath.forEach(value => {
        if (index !== 0) {
          temp = temp + '.' + value;
        }
        index++;
      }
    );
    if (temp === '') {
      temp = '.';
    }
    this.currentFolder = temp;
    console.log(this.currentFolder);
  }
}
