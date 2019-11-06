import { Component, OnInit } from '@angular/core';
import {DbnaryService} from '../../services/dbnary.service';
import {BoardService} from '../../services/board.service';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {GeticonService} from '../../services/geticon.service';
import {MulBerryObject} from '../../libTypes';
import mullberryJson from '../../../assets/symbol-info.json';
import {DomSanitizer} from '@angular/platform-browser';
import {Ng2ImgMaxService} from 'ng2-img-max';
import {Action, Element} from '../../types';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {ParametersService} from "../../services/parameters.service";

@Component({
  selector: 'app-edition',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.css']
})
export class EditionComponent implements OnInit {

  radioTypeFormat = 'button';
  name = '';
  events: { InteractionID: string, ActionList: Action[] }[] = [];
  color = '#d3d3d3';
  imageURL;
  classe = '';

  variantList = [];

  choseImage = false;
  variantDisplayed = false;
  eventDisplayed = false;
  imageList: any[];
  currentInterraction: { InteractionID: string, ActionList: Action[] } = null;

  constructor(public parametersService: ParametersService, public indexedDBacess: IndexeddbaccessService, public ng2ImgMaxService: Ng2ImgMaxService, public sanitizer: DomSanitizer, public userToolBar: UsertoolbarService, public getIconService: GeticonService, public dbnaryService: DbnaryService, public boardService: BoardService) {

  }

  ngOnInit() {
    this.userToolBar.ElementListener.subscribe(value => {
      this.updatemodif();
    });
  }

  selectInteraction(i: number) {
    this.currentInterraction = this.events.find(x => x.InteractionID === this.parametersService.interaction[i - 1]);
  }

  isCurrentInteraction(i) {
    if (this.currentInterraction != null && this.currentInterraction !== undefined) {
      return this.currentInterraction.InteractionID === this.parametersService.interaction[i - 1];
    }
    return false;
  }

  close() {
    if (this.choseImage || this.variantDisplayed || this.eventDisplayed) {
    this.choseImage = false;
    this.variantDisplayed = false;
    this.eventDisplayed = false;
    } else {
    this.userToolBar.add = false;
    this.userToolBar.modif = null;
    this.clear(); }
  }

  closeVariant() {
    this.variantList = this.dbnaryService.wordList.filter(b => b.selected);
    this.variantDisplayed = false ;
  }

  clear() {
    this.name = '';
    this.color = '#d3d3d3';
    this.imageURL = '';
    this.imageList = [];
    this.dbnaryService.wordList = [];
    this.dbnaryService.typeList = [];
  }

  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  isPartOfCurrentInteraction(interactionId) {
    if (this.currentInterraction != null) {
      const res = this.currentInterraction.ActionList.find(x => x.ActionID === interactionId);
      return res != null && res !== undefined;
    }
    return false;
  }

  uploadDocument(text: string) {
    this.imageList = [];
    let tempList = [];
    (mullberryJson as unknown as MulBerryObject[]).forEach(value => {
      if (text !== null && text !== '' && value.symbol.toLowerCase().includes(text.toLocaleLowerCase())) {
        const url = value.symbol;
        tempList.push(url);
        tempList = tempList.sort((a: string, b: string) => {
            if (a.toLowerCase().startsWith(text.toLowerCase()) && b.toLowerCase().startsWith(text.toLowerCase())) {
              return a.length - b.length;
            } else if ( a.toLowerCase().startsWith(text.toLowerCase())) {
              return -1;
            } else {
              return 1;
            }

          }
        );
      }
    }, this);
    this.imageList = tempList.slice(0, 100);
  }

  previewWithURL(t) {
    this.imageURL = t;
    this.choseImage = false;
  }
  previewMullberry(t) {
    this.previewWithURL('assets/libs/mulberry-symbols/EN-symbols/' + t + '.svg');
    this.choseImage = false;
  }

  previewFile(files) {
    this.imageURL = 'assets/icons/load.gif';
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();

    this.ng2ImgMaxService.resize([files[0]], 1000, 1000).subscribe(result => {
      reader.readAsDataURL(result);
      reader.onload = (e) => {
        this.imageURL = reader.result;
        this.choseImage = false;
      };
    }, error => {
      reader.readAsDataURL(files[0]);
      reader.onload = (e) => {
        this.imageURL = reader.result;
        this.choseImage = false;
      };
    });
  }

  save() {
    if (this.userToolBar.add) {
      this.createNewButton();
    } else if (this.userToolBar.modif !== null) {
      this.modifyButton();
    }
    this.indexedDBacess.update();
    this.close();
  }

  modifyButton() {
    // tslint:disable-next-line:no-shadowed-variable
    const element: Element = this.userToolBar.modif;
    element.ElementType = this.radioTypeFormat;
    const defaultform = element.ElementForms.find(form => {
      const newForm = form.LexicInfos.find(info => {
        return (info.default != null && info.default);
      });
      return (newForm != null);
    });
    if (defaultform != null) {
    defaultform.DisplayedText = this.name;
    defaultform.VoiceText = this.name;
    } else {
      element.ElementForms.push({
        DisplayedText: this.name,
        VoiceText: this.name,
        LexicInfos: [{default: true}]
      });
    }
    this.variantList.forEach( variant => {
      element.ElementForms.push({
        DisplayedText: variant.val,
        VoiceText: variant.val,
        LexicInfos: variant.info
      });
    });
    element.Color = this.color;
    element.ImageID = this.boardService.currentFolder + this.name;

    this.boardService.board.ImageList = this.boardService.board.ImageList.filter( img => img.ImageID !== this.boardService.currentFolder + this.name);

    this.boardService.board.ImageList.push(
      {
        ImageID: this.boardService.currentFolder + this.name,
        ImageLabel: this.name,
        ImagePath: this.imageURL
      });
  }

  createNewButton() {
    const elementForms = [];
    elementForms.push({DisplayedText: this.name,
      VoiceText: this.name,
      LexicInfos: [{default: true}] });
    this.variantList.forEach( variant => {
      elementForms.push({
        DisplayedText: variant.val,
        VoiceText: variant.val,
        LexicInfos: variant.info
      });
    });

    const interList = [{
      InteractionID: 'click', ActionList: [{
        ActionID: 'display', Action: 'display'}, {
        ActionID: 'say', Action: 'say'}]}, {
      InteractionID: 'longPress', ActionList: [{
        ActionID: 'otherforms', Action: 'otherforms'}]}];



    this.boardService.board.ElementList.push(
      {
        ElementID: this.name,
        ElementFolder: this.boardService.currentFolder,
        ElementType: this.radioTypeFormat,
        ElementPartOfSpeech: this.classe,
        ElementForms: elementForms,
        ImageID: this.boardService.currentFolder + this.name,
        InteractionsList: interList,
        Color: this.color
      });

    this.boardService.board.ImageList.push(
      {
        ImageID: this.boardService.currentFolder + this.name,
        ImageLabel: this.name,
        ImagePath: this.imageURL
      });
  }

  updatemodif() {
    if (this.userToolBar.modif !== null) {
    const elementToModif: Element = this.userToolBar.modif;
    this.name = elementToModif.ElementForms[0].DisplayedText;
    this.events = elementToModif.InteractionsList;
    this.color = elementToModif.Color;
    this.radioTypeFormat = elementToModif.ElementType;
    const imageToModif = this.boardService.board.ImageList.find(x => x.ImageID === elementToModif.ImageID);
    this.imageURL = imageToModif.ImagePath;
  }
    return false;
  }

  getWordList(word) {
    this.variantDisplayed = true;
    this.dbnaryService.typeList = [];
    this.dbnaryService.startsearch(1);
    this.dbnaryService.getWordPartOfSpeech(word, this.dbnaryService.typeList);
  }

  getEvents(e) {
    this.eventDisplayed = true;
    this.events = e;
    return this.events;
  }

  displayVariant(b, word) {
    this.dbnaryService.wordList = [];
    this.dbnaryService.startsearch(2);
    this.dbnaryService.getOtherFormsOfThisPartOfSpeechWord(word, b, this.dbnaryService.wordList);
  }
}

