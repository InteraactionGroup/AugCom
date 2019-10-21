import { Component, OnInit } from '@angular/core';
import {DbnaryService} from '../../services/dbnary.service';
import {EditionService} from '../../services/edition.service';
import {BoardService} from '../../services/board.service';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {GeticonService} from '../../services/geticon.service';
import {MulBerryObject} from '../../libTypes';
import mullberryJson from '../../../assets/symbol-info.json';
import {DomSanitizer} from '@angular/platform-browser';
import {Ng2ImgMaxService} from 'ng2-img-max';

@Component({
  selector: 'app-edition',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.css']
})
export class EditionComponent implements OnInit {

  radioTypeFormat;
  name;
  color = '#d3d3d3';
  imageURL;

  choseImage = false;
  variantDisplayed = false;
  imageList: any[];

  constructor(private ng2ImgMaxService: Ng2ImgMaxService, private sanitizer: DomSanitizer, private userToolBar: UsertoolbarService, private getIconService: GeticonService, private dbnaryService: DbnaryService, private editionService: EditionService, private boardService: BoardService) {

  }

  ngOnInit() {
    this.userToolBar.ElementListener.subscribe(value => {
      this.updatemodif();
    });
  }

  close() {
    this.userToolBar.add = false;
    this.userToolBar.modif = null;
    this.clear();
  }

  clear() {
    this.name = '';
    this.color = '#d3d3d3';
    this.imageURL = '';
    this.imageList = [];
  }

  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
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
      };
    }, error => {
      reader.readAsDataURL(files[0]);
      reader.onload = (e) => {
        this.imageURL = reader.result;
      };
    });
  }

  save() {
    if (this.userToolBar.add) {
      this.createNewButton();
    } else if (this.userToolBar.modif !== null) {
      this.modifyButton();
    }
    this.close();
  }

  modifyButton() {
    // tslint:disable-next-line:no-shadowed-variable
    const element = this.userToolBar.modif;
    element.ElementType = this.radioTypeFormat;
    element.ElementForms = [
          {DisplayedText: this.name,
          VoiceText: this.name,
          LexicInfos: [] }
          ];
    element.ImageID = this.name;

    this.boardService.board.ImageList.push(
      {
        ImageID: this.name,
        ImageLabel: this.name,
        ImagePath: this.imageURL
      });
  }

  createNewButton() {
    this.boardService.board.ElementList.push(
      {
        ElementID: this.name,
        ElementFolder: this.boardService.currentFolder,
        ElementType: this.radioTypeFormat,
        ElementForms: [
          {DisplayedText: this.name,
            VoiceText: this.name,
            LexicInfos: [] }
        ],
        ImageID: this.name,
        InteractionsList: []
      });

    this.boardService.board.ImageList.push(
      {
        ImageID: this.name,
        ImageLabel: this.name,
        ImagePath: this.imageURL
      });
  }

  updatemodif() {
    if (this.userToolBar.modif !== null) {
    const elementToModif = this.userToolBar.modif;
    this.name = elementToModif.ElementForms[0].DisplayedText;
    const imageToModif = this.boardService.board.ImageList.find(x => x.ImageID === elementToModif.ImageID);
    this.imageURL = imageToModif.ImagePath;
  }
    return false;
  }

  getWordList() {
    this.variantDisplayed = !this.variantDisplayed;
    this.dbnaryService.typeList = [];
    this.dbnaryService.getWordPartOfSpeech(this.name, this.dbnaryService.typeList);
  }
  displayVariant(b){
    this.dbnaryService.wordList = [];
    this.dbnaryService.getOtherFormsOfThisPartOfSpeechWord(this.name, b, this.dbnaryService.wordList);
  }

}
