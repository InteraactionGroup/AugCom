import { Component, OnInit } from '@angular/core';
import { EditionService } from '../../services/edition.service';
import { DbnaryService } from '../../services/dbnary.service';
import { GeticonService } from '../../services/geticon.service';
import { HttpClient } from '@angular/common/http';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ElementForm } from '../../types';
import { BoardService } from '../../services/board.service';
import { MultilinguismService } from '../../services/multilinguism.service';
import { ConfigurationService } from "../../services/configuration.service";
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import {SearchPictoInLibraryService} from "../../services/search-picto-in-library.service";


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
    public searchPictoInLibrary: SearchPictoInLibraryService,
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

  /**
   * Saves the current form. If current mod is 'addNew' also creates a new variant, else only edit the existing one
   */
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

  /**
   * Deletes the form in parameter from the variants list
   * @param elementForm form marked to be deleted
   */
  deleteElementForm(elementForm: ElementForm) {
    this.editionService.variantList = this.editionService.variantList.filter(elt => {
      return elt !== elementForm
    });
  }

  /**
   * Gives a name (= an ID) to the image actually selected in the form
   * @returns created ID of the image
   */
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

  /**
   * Changes selected form and resets form values
   */
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

  /**
   * Changes title of the form depending on parameter and current cod
   * @param s string representing current objective (name, image, or table)
   * @returns id of multilingism representing the chosen title
   */
  getTitle(s: string) {
    switch (s) {
      case 'name':
        return this.currentMode === 'modif' ? 'modifyWord' : 'chooseWord';
      case 'image':
        return this.currentMode === 'modif' ? 'modifyImage' : 'chooseImage';
      case 'table':
        return 'addWordVariantManually';
      default:
        return '';
    }
  }

  /**
   * Selects the item in parameter. Item corresponds to an alternative form
   * @param itemSelected item to be selected
   */
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
        this.imageSelectionStarted = this.searchPictoInLibrary.previewWithURL(reader.result);
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

  /**
   * @returns an url corresponding to the current form image's name
   */
  getPreviewURL() {
    return 'url(' + this.elementFormNameImageURL + ')';
  }

  /**
   *
   * @param elt library to be used and word to be searched
   * @returns an url corresponding to the searched image's name in the selected library
   */
  getThumbnailPreviewLibrary(elt: { lib, word }) {
    if (elt.lib === 'mulberry') {
      return 'url(\'assets/libs/mulberry-symbols/EN-symbols/' + elt.word + '.svg\')';
    } else if (elt.lib === 'arasaacNB') {
      return 'url(\'assets/libs/FR_Noir_et_blanc_pictogrammes/' + elt.word + '.png\')';
    } else if (elt.lib === 'arasaacColor') {
      return 'url(\'assets/libs/FR_Pictogrammes_couleur/' + elt.word + '.png\')';
    }
  }

  private _filter(value: string): string[] {
    if (value.length > 1) {
      this.wordList = this.searchPictoInLibrary.searchInLib(value)[0];
      this.imageList = this.searchPictoInLibrary.searchInLib(value)[1];
      return this.wordList;
    }
  }
}
