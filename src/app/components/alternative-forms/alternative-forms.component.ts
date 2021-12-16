import {Component, OnInit} from '@angular/core';
import {EditionService} from '../../services/edition.service';
import {DbnaryService} from '../../services/dbnary.service';
import {GeticonService} from '../../services/geticon.service';
import {HttpClient} from '@angular/common/http';
import mullberryJson from '../../../assets/symbol-info.json';
import {MulBerryObject} from '../../libTypes';
import {Ng2ImgMaxService} from 'ng2-img-max';
import {ElementForm} from '../../types';
import {BoardService} from '../../services/board.service';
import {MultilinguismService} from '../../services/multilinguism.service';
declare var getUrlPicto:any;
declare var clearUrlImageJS:any;
declare var monitorInput:any;

@Component({
  selector: 'app-alternative-forms',
  templateUrl: './alternative-forms.component.html',
  styleUrls: ['./alternative-forms.component.css'],
  providers: [Ng2ImgMaxService, HttpClient]
})
export class AlternativeFormsComponent implements OnInit {

  constructor(public multilinguism: MultilinguismService,
              public ng2ImgMaxService: Ng2ImgMaxService,
              public boardService: BoardService,
              public getIconService: GeticonService,
              public dbnaryService: DbnaryService,
              public editionService: EditionService) {
  }

  imageList = [];
  elementFormNameImageURL: any = '';
  elementFormDisplayedWordField = '';
  elementFormPronouncedWordField = '';
  selectedItem: ElementForm = null;
  currentMode = '';
  imageSelectionStarted = false;

  ngOnInit() {
  }

  saveCurrentElementForm() {
    if (this.currentMode === 'modif' && this.selectedItem !== null) {
      this.selectedItem.DisplayedText = this.elementFormDisplayedWordField;
      this.selectedItem.VoiceText = this.elementFormPronouncedWordField;
      if (this.elementFormNameImageURL !== '') {
        this.selectedItem.ImageID = this.getNewCreatedImageName();
      } else {
        this.selectedItem.ImageID = '';
      }
    } else if (this.currentMode === 'addNew') {
      const newElementForm: ElementForm = new ElementForm();
      newElementForm.DisplayedText = this.elementFormDisplayedWordField;
      newElementForm.VoiceText = this.elementFormPronouncedWordField;
      if (this.elementFormNameImageURL !== '') {
        newElementForm.ImageID = this.getNewCreatedImageName();
      } else {
        newElementForm.ImageID = '';
      }
      newElementForm.LexicInfos = [];
      this.editionService.variantList.push(newElementForm);
    }
    this.currentMode = '';
    this.elementFormNameImageURL = '';
  }

  deleteElementForm(elementForm: ElementForm) {
    this.editionService.variantList = this.editionService.variantList.filter(elt => {
      return elt !== elementForm
    });
  }

  getNewCreatedImageName() {
    let i = 0;
    while (-1 !== this.boardService.board.ImageList.findIndex(img => {
      return img.ID === (this.elementFormDisplayedWordField + i)
    })) {
      i++;
    }
    this.boardService.board.ImageList.push({
      ID: this.elementFormDisplayedWordField + i,
      OriginalName: this.elementFormDisplayedWordField,
      Path: this.elementFormNameImageURL
    });
    return this.elementFormDisplayedWordField + i;
  }

  selectNewForm() {
    if (this.currentMode !== 'addNew') {
      this.currentMode = 'addNew';
      this.selectedItem = new ElementForm();
    } else {
      this.elementFormNameImageURL = '';
      this.elementFormDisplayedWordField = '';
      this.elementFormPronouncedWordField = '';
      this.currentMode = '';
    }
  }

  getTitle(s: string) {
    switch (s) {
      case 'name':
        return this.currentMode === 'modif' ? 'modifyWord' : 'chooseWord';
      case 'image':
        return this.currentMode === 'modif' ? 'modifyImage' : 'chooseImage';
      case 'table':
        return this.currentMode === 'addNew' ? 'addWordVariantManually' : '';
      default :
        return '';
    }
  }

  select(itemSelected) {
    if (this.currentMode !== 'modif' || this.selectedItem !== itemSelected) {
      this.currentMode = 'modif';
      this.selectedItem = itemSelected;
      this.imageSelectionStarted = false;
      this.elementFormDisplayedWordField = itemSelected.DisplayedText;
      this.elementFormPronouncedWordField = itemSelected.VoiceText;
    } else {
      this.currentMode = '';
    }
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

  getVariantListExceptDefault() {
    if (this.editionService.add) {
      const defaultForm = this.editionService.getDefaultFormIfExists(this.editionService.variantList);
      return this.editionService.variantList.filter(variant => {
        return variant !== defaultForm
      });
    } else {
      const defaultForm = this.editionService.getDefaultForm(this.editionService.variantList);
      return this.editionService.variantList.filter(variant => {
        return variant !== defaultForm
      });
    }
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
    this.imageSelectionStarted = true;
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
        // this.choseImage = false;
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

  getSanitizeURL(elementForm: ElementForm) {
    if (elementForm !== this.selectedItem ||
      !this.imageSelectionStarted ||
      this.elementFormNameImageURL === null ||
      this.elementFormNameImageURL === '') {
      const elementImage = this.boardService.board.ImageList.find(image => {
        return image.ID === elementForm.ImageID
      });
      if (elementImage !== null && elementImage !== undefined) {
        return 'url(' + elementImage.Path + ')';
      }
      return '';
    } else {
      this.getPreviewURL();
    }
  }

  getPreviewURL() {
    return 'url(' + this.elementFormNameImageURL + ')';
  }

  /**
   * Set the current preview imageUrl with the image string Url 't' and close the chooseImage panel
   *
   * @param t, the new imageUrl
   */
  previewWithURL(t) {
    this.imageSelectionStarted = true;
    this.elementFormNameImageURL = t;
    // this.choseImage = false;
  }

  /**
   * Set the current preview imageUrl with a mulberry library image Url according to the given string 't' and close the chooseImage panel
   *
   * @param t, the string short name of the image of the mulberry library image
   */
  previewMullberry(t: string) {
    this.imageSelectionStarted = true;
    this.previewWithURL(t);
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

  /**
   * Return the list of 100 first mullberry library images, sorted by length name, matching with string 'text'
   *
   * @param text, the string researched text
   * @return list of 100 mulberry library images
   */
  searchInLibApi(text: string){
    this.imageList = [];
    let tempList: any[];
    clearUrlImageJS();
    monitorInput(text, 'fra');
    setTimeout(() => {
      tempList = getUrlPicto();
      this.imageList = tempList[0].slice(0,100);
    }, 500);
  }
}
