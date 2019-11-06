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

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent implements OnInit {

  pressTimer;

  clickedElement: Element = null;
  fakeElementTempList = [];

  // tslint:disable-next-line:max-line-length
  constructor(public parametersService: ParametersService, public indexeddbaccessService: IndexeddbaccessService, public userToolBarService: UsertoolbarService, public getIconService: GeticonService, public boardService: BoardService, public historicService: HistoricService, public editionService: EditionService, public otherFormsService: OtherformsService) { }

  ngOnInit() {
    this.indexeddbaccessService.init();
  }


  getTempList( ) {
    if (this.boardService.activatedElement === -1) {
        return this.getNormalTempList();
    } else {
        return this.fakeElementTempList;
    }
  }

  getNormalTempList() {
    return this.boardService.board.ElementList.filter(elt =>  {
      return this.boardService.currentFolder === elt.ElementFolder;
    }).slice(0 , 5 * ( 12 - this.boardService.sliderValue) - 2);
  }

  updateSliderValue() {
    this.boardService.board.GridInfo = this.boardService.sliderValue;
  }
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

  checkNounForms(elt: ElementForm): boolean {
    let gender = this.boardService.currentNounTerminaison.currentGender === '' || elt.LexicInfos.find(info => info.gender != null && info.gender !== undefined) === undefined;
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

  changePronomInfo( elementForm: ElementForm) {
    const person = elementForm.LexicInfos.find(info => info.person != null && info.person !== undefined);
    this.boardService.currentVerbTerminaison.currentPerson = (person != null && person !== undefined) ? person.person : 'thirdPerson';


    const num = elementForm.LexicInfos.find(info => info.number != null && info.number !== undefined);
    this.boardService.currentVerbTerminaison.currentNumber = (num != null && num !== undefined) ? num.number : '';
  }

  changeArticleInfo( elementForm: ElementForm) {
    const gender = elementForm.LexicInfos.find(info => info.gender != null && info.gender !== undefined);
    this.boardService.currentNounTerminaison.currentGender = (gender != null && gender !== undefined) ? gender.gender : '';

    const num = elementForm.LexicInfos.find(info => info.number != null && info.number !== undefined);
    this.boardService.currentNounTerminaison.currentNumber = (num != null && num !== undefined) ? num.number : '';
  }


  pointerDown(element: Element) {
    if (!this.userToolBarService.edit) {
      this.clickedElement = element;
      this.pressTimer = window.setTimeout(x => {
        this.longClick(element);
      }, this.parametersService.longpressTimeOut);
    }
  }

  pointerUp(element: Element) {
    if (!this.userToolBarService.edit) {
      window.clearTimeout(this.pressTimer);
      if (this.clickedElement !== null && this.clickedElement === element) {
          this.normalClick(element);
      }
    }
  }

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
    while (index + 12 - this.boardService.sliderValue + 1 > tempOtherFOrmList.length - 1 ) { // fill with empy elements
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

  createPlaces(index) {
    const places = [];
    const slider = 12 - this.boardService.sliderValue;

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
          });
        }
      });
    }
  }

  normalClick(element: Element) {
    if (element.ElementType === 'button') {

      const prononcedText = this.getLabel(element);
      const color = element.Color;
      const imgUrl = this.boardService.getImgUrl(element);
      const vignette: Vignette = {
        VignetteLabel: prononcedText,
        VignetteImageUrl: imgUrl,
        VignetteColor: color};

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
              if (action.ActionID === 'resetTerminaisons') {
               this.boardService.resetTerminaisons();
              }
            });
          } else if (inter.InteractionID === 'backFromVariant' ) {
            this.boardService.activatedElement = -1;
          }

          if (element.ElementPartOfSpeech != null && element.ElementPartOfSpeech !== undefined && element.ElementPartOfSpeech === ('article défini')) {
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

  edit(element: Element) {
    if (this.userToolBarService.edit) {
      this.userToolBarService.modif = element;
      this.userToolBarService.ElementListener.next(element);
      this.userToolBarService.add = false;
    }
  }

  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

}
