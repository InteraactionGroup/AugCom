import {Component, OnInit} from '@angular/core';
import {EditionService} from "../../services/edition.service";
import {DbnaryService} from "../../services/dbnary.service";
import {GeticonService} from "../../services/geticon.service";
import {HttpClient} from "@angular/common/http";
import mullberryJson from "../../../assets/symbol-info.json";
import {MulBerryObject} from "../../libTypes";
import {Ng2ImgMaxService} from "ng2-img-max";
import {DomSanitizer} from "@angular/platform-browser";
import {ElementForm} from "../../types";
import {BoardService} from "../../services/board.service";

@Component({
  selector: 'app-alternative-forms',
  templateUrl: './alternative-forms.component.html',
  styleUrls: ['./alternative-forms.component.css'],
  providers: [Ng2ImgMaxService, HttpClient]
})
export class AlternativeFormsComponent implements OnInit {

  constructor(public sanitizer: DomSanitizer, public ng2ImgMaxService: Ng2ImgMaxService, public boardService: BoardService, public getIconService: GeticonService, public dbnaryService: DbnaryService, public editionService: EditionService) {
  }

  ngOnInit() {
  }

  imageList=[];
  elementFormNameImageURL: any =''
  elementFormNameField='';
  selectedItem: ElementForm =null;
  selectedFile;
  selectedFeature=''; //can be add or modif
  imageSelectionStarted=false;

  saveCurrentElementForm(){
  if (this.selectedItem !== null) {
    this.selectedItem.DisplayedText = this.elementFormNameField;
    this.selectedItem.VoiceText = this.elementFormNameField;
    let i = 0;
    while(-1 !== this.boardService.board.ImageList.findIndex( img => {return img.ID === (this.elementFormNameField + i)})){
      i++;
    }
    this.boardService.board.ImageList.push({
      ID: this.elementFormNameField + i,
      OriginalName: this.elementFormNameField,
      Path: this.elementFormNameImageURL
    });
    this.selectedItem.ImageID = this.elementFormNameField + i;
  }
  }

  select(b){
    this.selectedItem = this.selectedItem === b ? null : b;
  }

  isVariantDisplayed() {
    return this.editionService.currentEditPage === 'Autres formes';
  }

  /**
   * Actualize the variants forms list (wordList) of the word 'word' with the grammatical type b
   * (ex: displayVariant('-nom-','chien') will actualise the wordList with ['chien','chiens','chienne','chiennes'])
   * @param classe, a grammatical type (ex: -verb-, -nom-...).
   * @param word, a string word
   */
  displayVariant(classe: string, word: string) {
    this.dbnaryService.wordList = [];
    this.dbnaryService.startsearch(2);
    this.dbnaryService.getWords(classe);
  }


  /**
   * Actualize the grammatical type list (typeList)  of the word 'word'
   * (ex: if word = 'bleu' typeList will be ['-nom-','-adj-'] because bleu can be a noun or an adjective
   * @param word, a string word
   */
  getWordList(word) {
    this.dbnaryService.typeList = [];
    this.editionService.classe = '';
    this.dbnaryService.startsearch(1);
    this.dbnaryService.getTypes(word);
  }

  /**
   * add the selected variant forms in wordList to the current variantList
   * and close the variant panel by setting variantDisplayed to false
   */
  closeVariant() {
    this.editionService.variantList = this.dbnaryService.wordList.filter(b => b.selected);
    this.editionService.currentEditPage = '';
  }

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  /**
   * Set the current preview imageUrl according to the given file 'file' and close the chooseImage panel
   * if the initial image is bigger than 1000*1000 the the image is reduced
   *
   * @param file, a file element
   */
  previewFile(file) {
    this.imageSelectionStarted=true;
    this.elementFormNameImageURL = 'assets/icons/load.gif';
    if (file === null) {
      return;
    }
    if (file.length === 0) {
      return;
    }
    const mimeType = file[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();

    this.ng2ImgMaxService.resize([file[0]], 1000, 1000).subscribe(result => {
      reader.readAsDataURL(result);
      reader.onload = () => {
        this.elementFormNameImageURL = reader.result;
        //this.choseImage = false;
      };
    }, () => {
      reader.readAsDataURL(file[0]);
      reader.onload = () => {
        this.previewWithURL(reader.result);

      };
    });


    console.log(this.elementFormNameImageURL);
    console.log(this.selectedItem.DisplayedText)
  }

  getSanitizeURL(elementForm: ElementForm){
    if( elementForm !== this.selectedItem ||  !this.imageSelectionStarted || this.elementFormNameImageURL===null || this.elementFormNameImageURL==='') {
      let elementImage = this.boardService.board.ImageList.find(image => {
        return image.ID === elementForm.ImageID
      })
      if (elementImage !== null && elementImage !== undefined) {
        return 'url(' + elementImage.Path + ')';
      }
      return '';
    } else {
      return 'url(' + this.elementFormNameImageURL + ')';
    }
  }


  /**
   * Set the current preview imageUrl with the image string Url 't' and close the chooseImage panel
   *
   * @param t, the new imageUrl
   */
  previewWithURL(t) {
    this.imageSelectionStarted=true;
    this.elementFormNameImageURL = t;
    //this.choseImage = false;
  }

  /**
   * Set the current preview imageUrl with a mulberry library image Url according to the given string 't' and close the chooseImage panel
   *
   * @param t, the string short name of the image of the mulberry library image
   */
  previewMullberry(t: string) {
    this.imageSelectionStarted=true;
    this.previewWithURL('assets/libs/mulberry-symbols/EN-symbols/' + t + '.svg');
  }

  /**
   * Return the list of 100 first mullberry library images, sorted by length name, matching with string 'text'
   *
   * @param text, the string researched text
   * @return list of 100 mulberry library images
   */
  searchInLib(text: string) {
    this.imageList = [];
    let tempList = [];
    (mullberryJson as unknown as MulBerryObject[]).forEach(value => {
      if (text !== null && text !== '' && value.symbol.toLowerCase().includes(text.toLocaleLowerCase())) {
        const url = value.symbol;
        tempList.push(url);
        tempList = tempList.sort((a: string, b: string) => {
            if (a.toLowerCase().startsWith(text.toLowerCase()) && b.toLowerCase().startsWith(text.toLowerCase())) {
              return a.length - b.length;
            } else if (a.toLowerCase().startsWith(text.toLowerCase())) {
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


}
