import { Component, OnInit } from '@angular/core';
import {HistoricService} from '../../services/historic.service';
import {EditionService} from '../../services/edition.service';
import {OtherformsService} from '../../services/otherforms.service';
import {BoardService} from '../../services/board.service';
import {Element, ElementForm, Vignette} from '../../types';
import {GeticonService} from '../../services/geticon.service';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent implements OnInit {


  // tslint:disable-next-line:max-line-length
  constructor(public indexeddbaccessService: IndexeddbaccessService, public userToolBarService: UsertoolbarService, public getIconService: GeticonService, public boardService: BoardService, public historicService: HistoricService, public editionService: EditionService, public otherFormsService: OtherformsService) { }

  ngOnInit() {
    this.indexeddbaccessService.init();
  }

  updateSliderValue() {
    this.boardService.board.GridInfo = this.boardService.sliderValue;
  }
  getLabel(element: Element) {
    const adaptedElement = element.ElementForms.find(elt => this.checkForms(elt) );
    if (adaptedElement != null) {
      return adaptedElement.DisplayedText;
    } else {
      const defaultElement = element.ElementForms.find(elt => this.checkDefault(elt) );
      if (defaultElement != null) {
        return defaultElement.DisplayedText;
      } else {
        return element.ElementForms[0].DisplayedText;
      }
    }
  }

  checkForms(elt: ElementForm): boolean {
    let person = false;
    let n = false;
    elt.LexicInfos.forEach(info => {
      if (info.person != null
        && info.person === 'http://www.lexinfo.net/ontology/2.0/lexinfo#' + this.boardService.currentPerson) {
        person = true;
      }

      if (info.number != null
        && info.number === 'http://www.lexinfo.net/ontology/2.0/lexinfo#' + this.boardService.currentNumber) {
        n = true;
      }
    });
    return person && n;
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
    this.boardService.currentPerson = elementForm.LexicInfos[0].person;
    this.boardService.currentNumber = elementForm.LexicInfos[1].number;
  }

  clickTriggered(element: Element) {
    if (element.ElementType === 'button') {
      const prononcedText = this.getLabel(element);
      const color = element.Color;
      const imgUrl = this.boardService.getImgUrl(element);
      const vignette: Vignette = {
        VignetteLabel: prononcedText,
        VignetteImageUrl: imgUrl,
        VignetteColor: color};

      this.historicService.push(vignette);
      this.historicService.say('' + prononcedText);

      if (element.InteractionsList.length > 0 ) {
        if (element.InteractionsList[0].InteractionID === 'click') {
          if (element.InteractionsList[0].ActionList[0].ActionID === 'pronomChangeInfo') {
            this.changePronomInfo(element.ElementForms[0]);
          }
        }
      } else {
        this.boardService.currentNumber = '';
        this.boardService.currentPerson = '';
        this.boardService.currentGender = '';
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
    this.userToolBarService.modif = element;
    this.userToolBarService.ElementListener.next(element);
    this.userToolBarService.add = false;
  }

  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

}
