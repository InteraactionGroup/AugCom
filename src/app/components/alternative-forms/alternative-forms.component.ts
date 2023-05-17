import {Component, OnInit} from '@angular/core';
import {EditionService} from '../../services/edition.service';
import {DbnaryService} from '../../services/dbnary.service';
import {GeticonService} from '../../services/geticon.service';
import {HttpClient} from '@angular/common/http';
import mullberryJson from '../../../assets/symbol-info.json';
import arasaacJson from '../../../assets/arasaac-symbol-info.json';
import arasaacColoredJson from '../../../assets/arasaac-color-symbol-info.json';
import {MulBerryObject, ArasaacObject} from '../../libTypes';
import {Ng2ImgMaxService} from 'ng2-img-max';
import {ElementForm} from '../../types';
import {BoardService} from '../../services/board.service';
import {MultilinguismService} from '../../services/multilinguism.service';
import {ConfigurationService} from "../../services/configuration.service";

import {Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";


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
              public configurationService: ConfigurationService,
              public editionService: EditionService) {
  }

  imageList = [];
  elementFormNameImageURL: any = '';
  elementFormDisplayedWordField = '';
  elementFormPronouncedWordField = '';
  selectedItem: ElementForm = null;
  currentMode = '';
  imageSelectionStarted = false;

  wordList: string[] = [];

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
        startWith(''),
        map(value => this._filter(value))
    );
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
        return  'addWordVariantManually';
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
      this.elementFormNameImageURL = this.getSanitizeURL(itemSelected);
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


  previewLibrary(elt: { lib, word }) {
    this.imageSelectionStarted = true;
    if (elt.lib === 'mulberry') {
      if(!this.boardService.board.libraryUsed.includes('Mulberry')){
        this.boardService.board.libraryUsed.push('Mulberry');
      }
      this.previewMullberry(elt.word);
    } else if (elt.lib === 'arasaacNB') {
      this.previewArasaac(elt.word, false);
      if(!this.boardService.board.libraryUsed.includes('Arasaac')) {
        this.boardService.board.libraryUsed.push('Arasaac');
      }
    } else if (elt.lib === 'arasaacColor') {
      this.previewArasaac(elt.word, true);
      if(!this.boardService.board.libraryUsed.includes('Arasaac')) {
        this.boardService.board.libraryUsed.push('Arasaac');
      }
    }
  }

  getThumbnailPreviewLibrary(elt: { lib, word }) {
    if (elt.lib === 'mulberry') {
      return 'url(\'assets/libs/mulberry-symbols/EN-symbols/' + elt.word + '.svg\')';
    } else if (elt.lib === 'arasaacNB') {
      return 'url(\'assets/libs/FR_Noir_et_blanc_pictogrammes/' + elt.word + '.png\')';
    } else if (elt.lib === 'arasaacColor') {
      return 'url(\'assets/libs/FR_Pictogrammes_couleur/' + elt.word + '.png\')';
    }
  }

  /**
   * Set the current preview imageUrl with a mulberry library image Url according to the given string 't' and close the chooseImage panel
   *
   * @param t, the string short name of the image of the mulberry library image
   */
  previewMullberry(t: string) {
    this.previewWithURL('assets/libs/mulberry-symbols/EN-symbols/' + t + '.svg');
  }


  previewArasaac(t: string, isColored: boolean) {
    if (isColored) {
      this.previewWithURL('assets/libs/FR_Pictogrammes_couleur/' + t + '.png');
    } else {
      this.previewWithURL('assets/libs/FR_Noir_et_blanc_pictogrammes/' + t + '.png');
    }
  }

  /**
   * Return the list of 100 first mullberry and Arasaac library images, sorted by length name, matching with string 'text'
   *
   * @param text, the string researched text
   * @return list of 100 mulberry library images
   */
  searchInLib(text: string) {
    this.imageList = [];
    let tempList = [];

    if(this.configurationService.LANGUAGE_VALUE === 'FR') {
      (arasaacJson as unknown as ArasaacObject)[0].wordList.forEach(word => {
        if (text !== null && text !== '' && word.toLowerCase().includes(text.toLocaleLowerCase()) && this.getSimilarity(text.toLowerCase(), word.toLowerCase()) >= 0.5) {
          const url = word;
          tempList.push({lib: 'arasaacNB', word: this.cleanString(url)});
        }
      }, this);

      (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.forEach(word => {
        if (text !== null && text !== '' && word.toLowerCase().includes(text.toLocaleLowerCase()) && this.getSimilarity(text.toLowerCase(), word.toLowerCase()) >= 0.5) {
          const url = word;
          tempList.push({lib: 'arasaacColor', word: this.cleanString(url)});
        }
      }, this);
    }
    else{
      (mullberryJson as unknown as MulBerryObject[]).forEach(value => {
        if (text !== null && text !== '' && value.symbol.toLowerCase().includes(text.toLocaleLowerCase()) && this.getSimilarity(text.toLowerCase(), value.symbol.toLowerCase()) >= 0.5) {
          const url = value.symbol;
          tempList.push({lib: 'mulberry', word: this.cleanString(url)});
        }
      }, this);
    }

    tempList = tempList.sort((a: { lib: any, word: string | any[] }, b: { lib: any, word: string | any[] }) => {
      return a.word.length - b.word.length;
    });

    // this.wordList = tempList;
    tempList.forEach(couple => {
      this.wordList.push(couple.word);
    });

    this.imageList = tempList.slice(0, 100);
  }

  cleanString(t: string) {
    return t.replace(/'/g, '\\\'');
  }

  /**
   * Checks the Levenshtein's distance (the similarity) between the two strings in param using Levenshtein's algorithm.
   * https://en.wikipedia.org/wiki/Levenshtein_distance
   * @param word1 First word to compare
   * @param word2 Second word to compare
   * @returns A float between 0 and 1. 0 means the two words are completely different; 1 means they are the same.
   */
  getSimilarity(word1, word2): number {
    let longer = word1;
    let shorter = word2;
    if (word1.length < word2.length) {
      longer = word2;
      shorter = word1;
    }
    
    return ((longer.length - this.distance(longer, shorter)) / parseFloat(longer.length));
  }

  /**
   * The main body of Levenshtein's algorithm
   * This should only be called by the method getSimilarity to avoid errors.
   * @param s1 first word
   * @param s2 second word
   * @returns the "cost" to get from the first word to the second AKA their distance
   */
  distance(s1, s2) {
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  private _filter(value: string): string[] {
    if(value.length > 1){
      this.wordList = [];
      this.searchInLib(value);
      return this.wordList;
    }
  }
}
