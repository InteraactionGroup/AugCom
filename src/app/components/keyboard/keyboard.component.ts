import { Component, OnInit } from '@angular/core';
import {HistoricService} from '../../services/historic.service';
import {EditionService} from '../../services/edition.service';
import {OtherformsService} from '../../services/otherforms.service';
import {BoardService} from '../../services/board.service';
import {Action, Element, ElementForm, Vignette} from '../../types';
import {GeticonService} from '../../services/geticon.service';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {ParametersService} from '../../services/parameters.service';
import {Router} from '@angular/router';
import {DragulaService} from 'ng2-dragula';
import dragula from 'dragula';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent implements OnInit {

  options: any = {
    removeOnSpill: true
  }

  /**
   * the current pressTimer started when pressing an element and ending on release
   */
  pressTimer;

  /**
   * the current pressed element
   */
  clickedElement: Element = null;

  /**
   * The current fakeElementTempList, updated when an element wants to display its variants
   */
  fakeElementTempList = [];

  // tslint:disable-next-line:max-line-length
  constructor(private dragulaService: DragulaService, private router: Router, public parametersService: ParametersService, public indexeddbaccessService: IndexeddbaccessService, public userToolBarService: UsertoolbarService, public getIconService: GeticonService, public boardService: BoardService, public historicService: HistoricService, public editionService: EditionService, public otherFormsService: OtherformsService) {
  }

  /**
   * execute the indexeddbaccessService init fucntion to get the information of the DB or to create new entries if there is no info
   */
  ngOnInit() {
    this.indexeddbaccessService.init();
  }

  initDragAndDrop() {
    if (!this.parametersService.dragNDropinit) {
      this.dragulaService.createGroup('VAMPIRE', {
        direction: 'horizontal',
        moves: (el, source, handle, sibling) => !this.userToolBarService.edit
      });
      this.parametersService.dragNDropinit = true;
    }
  }

  drop(elt: Element) {
    console.log(elt.ElementID);
  }

  /**
   * return the normal list of elements that have to be displayed on the board if no element displayed its variant forms
   * otherwise return the 'fakeElementTempList' of the element that is displaying its variant forms
   * @return a list of element
   */
  getTempList( ) {
    if (this.boardService.activatedElement === -1) {
        return this.getNormalTempList();
    } else {
        return this.fakeElementTempList;
    }
  }

  /**
   * return the part of elements that can fit in the board depending on the current rows and columns values
   * @return a list of elements
   */
  getNormalTempList() {
    return this.boardService.board.ElementList.filter(elt =>  {
      return this.boardService.currentFolder === elt.ElementFolder;
    }).slice(0 , this.boardService.sliderValueRow * this.boardService.sliderValueCol - 2);
  }

  // /**
  //  * update the grid cols and rows number depending on the values updated by the slider html
  //  */
  // updateSliderValue() {
  //   this.boardService.board.gridColsNumber = this.boardService.sliderValueCol;
  //   this.boardService.board.gridRowsNumber = this.boardService.sliderValueRow;
  // }

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
    const defaultElement = element.ElementForms.find(elt => this.checkDefault(elt) );
    if (defaultElement != null) {
      return defaultElement.DisplayedText;
    } else {
      if ( element.ElementForms.length > 0) {
        return element.ElementForms[0].DisplayedText;
      } else {
        return  '';
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
        && info.person === this.boardService.currentVerbTerminaison.currentPerson) {
        person = true;
      }

      if (!n && info.number != null
        && info.number === this.boardService.currentVerbTerminaison.currentNumber) {
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
    let gender = this.boardService.currentNounTerminaison.currentGender === '' ||
      elt.LexicInfos.find(info => info.gender != null && info.gender !== undefined) === undefined;
    let n = false;
    elt.LexicInfos.forEach(info => {
      if (!gender && info.gender != null
        && info.gender === this.boardService.currentNounTerminaison.currentGender) {

        gender = true;
      }

      if (!n && info.number != null
        && info.number === this.boardService.currentNounTerminaison.currentNumber) {
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

  /**
   * update the current person and number information for verb terminations
   * @param elementForm, an list of element forms
   */
  changePronomInfo( elementForm: ElementForm) {
    const person = elementForm.LexicInfos.find(info => info.person != null && info.person !== undefined);
    this.boardService.currentVerbTerminaison.currentPerson = (person != null && person !== undefined) ? person.person : 'thirdPerson';


    const num = elementForm.LexicInfos.find(info => info.number != null && info.number !== undefined);
    this.boardService.currentVerbTerminaison.currentNumber = (num != null && num !== undefined) ? num.number : '';
  }

  /**
   * update the current gender and number information for noun (and adj) terminations
   * @param elementForm, an list of element forms
   */
  changeArticleInfo( elementForm: ElementForm) {
    const gender = elementForm.LexicInfos.find(info => info.gender != null && info.gender !== undefined);
    this.boardService.currentNounTerminaison.currentGender = (gender != null && gender !== undefined) ? gender.gender : '';

    const num = elementForm.LexicInfos.find(info => info.number != null && info.number !== undefined);
    this.boardService.currentNounTerminaison.currentNumber = (num != null && num !== undefined) ? num.number : '';
  }


  /**
   * if not in edit mode
   * process the pointerDown event triggered by 'element' and starts the longpress timer
   * @param element, the element triggering the event
   */
  pointerDown(element: Element) {
    if (!this.userToolBarService.edit) {
      this.clickedElement = element;
      this.pressTimer = window.setTimeout(x => {
        this.longClick(element);
      }, this.parametersService.longpressTimeOut);
    }
  }

  /**
   * if not in edit mode
   * process the pointerUp event triggered by 'element' and execute its corresponding normal click function
   * if the element has not been longpressed yet
   * @param element, the element triggering the event
   */
  pointerUp(element: Element) {
    if (!this.userToolBarService.edit) {
      window.clearTimeout(this.pressTimer);
      if (this.clickedElement !== null && this.clickedElement === element) {
          this.normalClick(element);
      }
    }
  }

  /**
   * return the copy of the given 'element'
   * @param element, an element
   * @return the copied element
   */
  copy(element: Element): Element {
    return {
      ElementID: element.ElementID,
      ElementFolder: element.ElementFolder,
      ElementPartOfSpeech: element.ElementPartOfSpeech,
      ElementType: element.ElementType,
      ElementForms: element.ElementForms.copyWithin(0, 0 ),
      ImageID: element.ImageID,
      InteractionsList: element.InteractionsList.copyWithin(0, 0 ),
      Color: element.Color
    } as Element;
  }

  /**
   * return the copy of the given 'intaractions' list
   * @param interactions, an interaction list
   * @return the copied interaction List
   */
  copyInteractions( interactions: { InteractionID: string, ActionList: Action[] }[]) {
    const tempInter = [];
    interactions.forEach(inter => {
      const tempAction = [];
      inter.ActionList.forEach(act => {
        tempAction.push({ActionId: act.ActionID, Action: act.Action});
      });
      tempInter.push({InteractionID: inter.InteractionID, ActionList: tempAction});
    });
    return tempInter;
  }

  /**
   * process the different functions when the element identified by the index activatedElement want to display
   * its variant forms.
   * Create a tempOtherFOrmList that is displayed instead of the initial board
   */
  activatedElementTempList() {
    this.fakeElementTempList = [];
    this.boardService.board.ImageList.push({
      ImageID: '#back',
      ImageLabel: '#back',
      ImagePath: 'assets/icons/retour.svg'
    });
    const tempOtherFOrmList: Element[] = [];
    this.getNormalTempList().forEach( e => tempOtherFOrmList.push(this.copy(e)));
    const index = this.boardService.activatedElement;
    while (index + this.boardService.sliderValueCol + 1 > tempOtherFOrmList.length - 1 ) { // fill with empy elements
      tempOtherFOrmList.push({
        ElementID: '',
        ElementFolder: this.boardService.currentFolder,
        ElementType: 'button',
        ElementPartOfSpeech: '',
        ElementForms: [],
        ImageID: '',
        InteractionsList: [],
        Color: '#ffffff' // to delete later
      });
    }

    let indexOfForm = 1;
    const compElt = tempOtherFOrmList[index];
    tempOtherFOrmList.forEach( elt => {
      const tempIndex = tempOtherFOrmList.indexOf(elt);
      let places = this.createPlaces(index);
      places = places.slice(0, compElt.ElementForms.length - 1);
      if (places.includes(tempIndex)) {
        if (compElt.ElementForms.length > indexOfForm ) {
          elt.Color = '#aaaaaa';
          elt.ImageID = '' + compElt.ImageID;
          elt.ElementForms = [];
          elt.ElementPartOfSpeech = '' + compElt.ElementPartOfSpeech;
          elt.ElementForms.push(
            {
              DisplayedText: compElt.ElementForms[indexOfForm].DisplayedText,
              VoiceText: compElt.ElementForms[indexOfForm].VoiceText,
              LexicInfos: compElt.ElementForms[indexOfForm].LexicInfos
            });
          elt.InteractionsList = tempOtherFOrmList[index].InteractionsList.copyWithin(0, 0);
          elt.InteractionsList.push({ InteractionID: 'backFromVariant', ActionList: [] });
          indexOfForm = indexOfForm + 1;
        }
      } else if (tempIndex !== index) {
        elt.ElementID = '#disable';
        elt.InteractionsList = [];
      }
    });

    tempOtherFOrmList[index].Color = '#123548';
    tempOtherFOrmList[index].ImageID = '#back';
    tempOtherFOrmList[index].ElementPartOfSpeech = '';
    tempOtherFOrmList[index].InteractionsList = [{ InteractionID: 'backFromVariant', ActionList: [] }];
    tempOtherFOrmList[index].ElementForms = [{DisplayedText: 'back', VoiceText: 'back', LexicInfos: [] }];


    this.fakeElementTempList = tempOtherFOrmList;
  }
  /**
   * return the available neighbor index of an element identified by index 'ind'
   * @param ind, index of an element
   */
  createPlaces(ind: number) {
    const index = Number(ind);
    const slider: number = Number(this.boardService.sliderValueCol);
    const places = [];


    if (Math.trunc(  (index - 1) / slider ) === Math.trunc( index / slider)) { // gauche
      places.push(index - 1);
    }
    if (Math.trunc( (index + 1) / slider ) === Math.trunc( index / slider )) { // droite
      places.push(index + 1);
    }

    if (Math.trunc( (index - slider) / slider )  === Math.trunc( index / slider )  - 1) { // haut
      places.push(index - slider);
    }

    if (Math.trunc( (index - slider - 1) / slider )  === Math.trunc( index / slider )  - 1) { // haut gauche
      places.push(index - slider - 1);
    }

    if (Math.trunc( (index - slider + 1 ) / slider )  === Math.trunc( index / slider )  - 1) { // haut droite
      places.push(index - slider + 1);
    }

    if (Math.trunc( (index + slider) / slider )  === Math.trunc( index / slider ) + 1) { // bas
      places.push(index + slider);
    }

    if (Math.trunc( (index + slider - 1) / slider )  === Math.trunc( index / slider ) + 1) { // bas gauche
      places.push(index + slider - 1);
    }

    if (Math.trunc( (index + slider + 1) / slider )  === Math.trunc( index / slider ) + 1) { // bas droite
      places.push(index + slider + 1);
    }

    return places;
  }
  /**
   * process the different functions when the element is ' long clicked' (longPressed)
   * depending on its grammatical class, its type (button or folder) and its interraction and action events
   * @param element, the element we clicked on
   */
  longClick(element: Element) {
    if (element.InteractionsList.length > 0 ) {
      element.InteractionsList.forEach(inter => {
        if (inter.InteractionID === 'longPress') {
          inter.ActionList.forEach( action => {
            if (action.ActionID === 'otherforms') {
              if (element.ElementForms.length > 2) {
                this.boardService.activatedElement = this.getNormalTempList().indexOf(element);
                this.activatedElementTempList();
                this.clickedElement = null;
              }
            }

            const prononcedText = this.getLabel(element);
            const color = element.Color;
            const imgUrl = this.boardService.getImgUrl(element);
            const vignette: Vignette = {
              VignetteLabel: prononcedText,
              VignetteImageUrl: imgUrl,
              VignetteColor: color};

            if (action.ActionID === 'display') {
              this.historicService.push(vignette);
            }
            if (action.ActionID === 'say') {
              this.historicService.say('' + prononcedText);
            }

          });
        }
      });
    }
  }

  /**
   * process the different functions when the element is ' normal clicked' (press then release)
   * depending on its grammatical class, its type (button or folder) and its interraction and action events
   * @param element, the element we clicked on
   */
  normalClick(element: Element) {
    if (element.ElementType === 'button') {

      const prononcedText = this.getLabel(element);
      const color = element.Color;
      const imgUrl = this.boardService.getImgUrl(element);
      const vignette: Vignette = {
        VignetteLabel: prononcedText,
        VignetteImageUrl: imgUrl,
        VignetteColor: color};

      let otherformsdisplayed = false; // todo y'a un problème ici

      if (element.InteractionsList.length > 0 ) {
        element.InteractionsList.forEach(inter => {
          if (inter.InteractionID === 'click') {
            inter.ActionList.forEach( action => {
              if (action.ActionID === 'pronomChangeInfo') {
                this.changePronomInfo(element.ElementForms[0]);
              }
              if (action.ActionID === 'display') {
                this.historicService.push(vignette);
              }
              if (action.ActionID === 'say') {
                this.historicService.say('' + prononcedText);
              }
              if (action.ActionID === 'otherforms') {
                if (element.ElementForms.length > 2) {
                  otherformsdisplayed = true;
                  this.boardService.activatedElement = this.getNormalTempList().indexOf(element);
                  this.activatedElementTempList();
                  this.clickedElement = null;
                }
              }
              if (action.ActionID === 'resetTerminaisons') {
               this.boardService.resetTerminaisons();
              }
            });
          } else if (!otherformsdisplayed && inter.InteractionID === 'backFromVariant' ) {
            this.boardService.activatedElement = -1;
          }

          if (element.ElementPartOfSpeech != null && element.ElementPartOfSpeech !== undefined &&
            element.ElementPartOfSpeech === ('article défini')) {
            this.changeArticleInfo(element.ElementForms[0]);
          }

          if (element.ElementPartOfSpeech === '-verb-') {
            this.boardService.resetVerbTerminaisons();
          }

          if (element.ElementPartOfSpeech === '-nom-') {
            this.changePronomInfo(element.ElementForms.find(eltF => (eltF.DisplayedText === this.getLabel(element))));
          }

        });
      }

    } else if (element.ElementType === 'folder') {
      this.historicService.say('' + element.ElementForms[0].DisplayedText);
      if (element.ElementFolder === '.') {
        this.boardService.currentFolder = element.ElementFolder + element.ElementID;
      } else {
        this.boardService.currentFolder = element.ElementFolder + '.' + element.ElementID;
      }
    } else {
      console.log(element.ElementType);
    }
  }

  /**
   * if we are in edit mode
   * set the information of the element we want to modify with the current 'element' informations
   * open the edition panel to modify the information of element 'element'
   * @param element, the Element we want to edit
   */
  edit(element: Element) {
    if (this.userToolBarService.edit) {
      this.router.navigate(['/edit']);
      this.userToolBarService.modif = element;
      this.userToolBarService.ElementListener.next(element);
      this.userToolBarService.add = false;
    }
  }

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

}
