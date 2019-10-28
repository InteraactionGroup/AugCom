import { Component, OnInit } from '@angular/core';
import {HistoricService} from '../../services/historic.service';
import {EditionService} from '../../services/edition.service';
import {OtherformsService} from '../../services/otherforms.service';
import {BoardService} from '../../services/board.service';
import {Element, ElementForm} from '../../types';
import {GeticonService} from '../../services/geticon.service';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent implements OnInit {

  sliderValue = 2;


  // tslint:disable-next-line:max-line-length
  constructor(public indexeddbaccessService: IndexeddbaccessService, public userToolBarService: UsertoolbarService, public getIconService: GeticonService, public boardService: BoardService, public historicService: HistoricService, public editionService: EditionService, public otherFormsService: OtherformsService) { }

  ngOnInit() {
    this.indexeddbaccessService.init();
  }

  getLabel(element: Element) {
    const list = element.ElementForms.filter(elt => this.checkForms(elt) );
    console.log(list);
    if (list[0] != null && list[0] !== undefined ) {
      return list[0].DisplayedText;
    } else {
     return element.ElementForms[0].DisplayedText;
    }
  }

  checkForms(elt: ElementForm): boolean {
    let b = false;
    elt.LexicInfos.forEach(info => {
      if (info.person != null && info.person !== undefined
        && info.person === 'http://www.lexinfo.net/ontology/2.0/lexinfo#' + this.boardService.currentPerson) {
        b = b || true;
      }
    });
    return b;
  }


  changePronomInfo( elementForm: ElementForm) {
    this.boardService.currentPerson = elementForm.LexicInfos[0].person;
    console.log(this.boardService.currentPerson);
  }

  clickTriggered(element: Element) {
    if (element.ElementType === 'button') {
      this.historicService.push(element);
      this.historicService.say('' + this.getLabel(element));

      if (element.InteractionsList.length > 0 ) {
        if (element.InteractionsList[0].InteractionID === 'click' && element.InteractionsList[0].ActionList[0].ActionID === 'pronomChangeInfo') {
          this.changePronomInfo(element.ElementForms[0]);
        }
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
