import {Injectable} from '@angular/core';
import {Board} from '../data/ExempleOfBoard';
import {GridElement, ElementForm, Grid} from '../types';
import {DomSanitizer} from '@angular/platform-browser';
import {EditionService} from './edition.service';
import {Ng2ImgMaxService} from 'ng2-img-max';

@Injectable({
  providedIn: 'root',
})
export class BoardService {

  constructor(public ng2ImgMaxService: Ng2ImgMaxService, public editionService: EditionService,
              public sanitizer: DomSanitizer) {
    this.board = Board;
  }

  /*background url value for grid background image*/
  background: any = '';

  board: Grid;
  currentPath = '#HOME';

  /*the current forms that verb and noun have to use to conjugate*/
  currentVerbTerminaison: { currentPerson: string, currentNumber: string } = {currentPerson: '', currentNumber: ''};
  currentNounTerminaison: { currentGender: string, currentNumber: string } = {currentGender: '', currentNumber: ''};

  /*element that is displaying its alternative forms*/
  activatedElement = -1;


  getCurrentFolder() {
    let path = this.currentPath.split('.');
    if (path != null){
      return path[path.length-1];
    } else {
      return '#HOME';
    }
  }

  getCurrentTitle() {
    let path = this.currentPath.split('.');
    if (path !== null){
      let name = '';
      let i = 0;
      if(path.length >= 4){
        i = path.length-3;
        name = '.../'
      }
      for(i; i <= path.length-1; i++){
        let id = path[i];
        let associatedPage = this.board.PageList.find(page => id === page.ID);
        if(associatedPage !== null && associatedPage !== undefined){
          name = name + associatedPage.Name + '/';
        } else {
          name = name + '?/';
        }
      }
      return name;
    }
    return 'Accueil';
  }

  /*reset board with default Board value*/
  resetBoard() {
    this.board = Board;
  }

  /*change background image of the grid*/
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
  getLabel(element: GridElement) {

    if (element.PartOfSpeech === '-verb-') {
      const verbElement = element.ElementFormsList.find(elt => this.checkVerbForms(elt));
      if (verbElement != null) {
        return verbElement.DisplayedText;
      }
    }

    if (element.PartOfSpeech === '-nom-' || element.PartOfSpeech === '-adj-') {
      const nounElement = element.ElementFormsList.find(elt => this.checkNounForms(elt));
      if (nounElement != null) {
        return nounElement.DisplayedText;
      }
    }
    return this.getDefaultLabel(element);
  }

  /**
   * return the default label of an element
   * @param element, an Element
   * @return return the default label of the element
   */
  getDefaultLabel(element: GridElement) {
    const defaultElement = element.ElementFormsList.find(elt => this.checkDefault(elt));
    if (defaultElement != null) {
      return defaultElement.DisplayedText;
    } else {
      if (element.ElementFormsList.length > 0) {
        return element.ElementFormsList[0].DisplayedText;
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

  /*reset default end of word*/
  resetTerminaisons() {
    this.resetVerbTerminaisons();
    this.currentNounTerminaison = {currentGender: '', currentNumber: ''};
  }

  /*reset default end of word for verbs*/
  resetVerbTerminaisons() {
    this.currentVerbTerminaison = {currentPerson: '', currentNumber: ''};
  }

  /*delete the element that is sentenced to death*/
  executer() {
    const imageTemp = [];

    //TODO
    // this.board.ElementList = this.board.ElementList.filter(x => {
    //     let isChildrenOfCondamnedElt = false;
    //     this.editionService.sentencedTodDeleteElement.forEach(condamnedElt => {
    //       isChildrenOfCondamnedElt = isChildrenOfCondamnedElt ||
    //         x.ElementFolder.startsWith(condamnedElt.ElementFolder + condamnedElt.ID);
    //     });
    //     return !isChildrenOfCondamnedElt;
    //   }
    // );

    this.board.ElementList = this.board.ElementList.filter(x => {
      let isCondamned = false;
      this.editionService.sentencedToBeDeletedElement.forEach(condamnedElt => {
        isCondamned = isCondamned || x === condamnedElt;
      });
      return !isCondamned;
    });

    this.board.ElementList.forEach(elt => {
      const res = this.board.ImageList.find(img => img.ID === elt.ElementFormsList[0].ImageID);
      if (res !== null && res !== undefined) {
        imageTemp.push(res);
      }
    });

    let currentPage = this.board.PageList.find(page => {
      return page.ID === this.getCurrentFolder()
    });

    if(currentPage !== null && currentPage !== undefined){
      currentPage.ElementIDsList = currentPage.ElementIDsList.filter(elt => {
        return this.editionService.sentencedToBeDeletedElement.findIndex( sentenced => {return sentenced.ID === elt}) === -1
      })
    }


    this.board.ImageList = imageTemp;
    this.editionService.sentencedToBeDeletedElement = [];

  }

  /*get sanitized image URL of an element*/
  getImgUrl(element: GridElement) {
    if (this.board.ImageList != null) {
      if(element.ElementFormsList.length > 0) {
        const path = this.board.ImageList.find(x => x.ID === element.ElementFormsList[0].ImageID);
        if (path !== null && path !== undefined) {
          const s = path.Path;
          if(s.replace( / /g ,'')===''){
            return '';
          }
          return this.sanitizer.bypassSecurityTrustStyle('url(\'' + s + '\')');
        } else {
          return '';
        }
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  /*get normal image URL of an element (with no sanitizing)*/
  getSimpleImgUrl(element: GridElement) {
    if (this.board.ImageList != null) {
      const path = this.board.ImageList.find(x => x.ID === element.ElementFormsList[0].ImageID);
      if (path !== null && path !== undefined) {
        const s = path.Path;
        if(s.replace(/ /g, '') === ''){
          return '';
        }
        return 'url(\'' + s + '\')';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  /*go back to parent folder*/
  backToPreviousFolder() {
    const path = this.currentPath.split('.');
    let temp = '#HOME';

    const newPath = path.slice(1, path.length - 1);
    newPath.forEach(value => {
      temp = temp + '.' + value;
    });

    if (temp === '') {
      temp = '#HOME';
    }

    this.currentPath = temp;
  }
}
