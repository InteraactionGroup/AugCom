import {Component, OnInit} from '@angular/core';
import {EditionService} from '../../services/edition.service';
import {Ng2ImgMaxService} from 'ng2-img-max';
import mullberryJson from '../../../assets/symbol-info.json';
import arasaacJson from '../../../assets/arasaac-symbol-info.json';
import arasaacColoredJson from '../../../assets/arasaac-color-symbol-info.json';
import {ArasaacObject, MulBerryObject} from '../../libTypes';
import {MultilinguismService} from '../../services/multilinguism.service';
import {ConfigurationService} from "../../services/configuration.service";
import {Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import {DialogAddUserComponent} from "../dialog-add-user/dialog-add-user.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogModifyColorInsideComponent} from "../dialog-modify-color-inside/dialog-modify-color-inside.component";
import {DialogModifyColorBorderComponent} from "../dialog-modify-color-border/dialog-modify-color-border.component";
import {BoardService} from "../../services/board.service";

@Component({
  selector: 'app-image-selection-page',
  templateUrl: './image-selection-page.component.html',
  styleUrls: ['./image-selection-page.component.css'],
  providers: [Ng2ImgMaxService]
})
export class ImageSelectionPageComponent implements OnInit {

  /**
   * the current list of images related to the chose image library search section
   * (the image list resulting in the research in the mullbery library)
   */
  imageList: { lib, word }[];

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  wordList: string[] = [];

  constructor(public multilinguism: MultilinguismService,
              public ng2ImgMaxService: Ng2ImgMaxService,
              public editionService: EditionService,
              public configurationService: ConfigurationService,
              public boardService: BoardService,
              public dialog: MatDialog) {
    this.searchInLib(this.editionService.imageTextField);
  }

  ngOnInit() {

    this.filteredOptions = this.myControl.valueChanges
        .pipe(
            startWith(''),
            map(value => this._filter(value))
        );

    if (this.editionService.defaultBorderColor != undefined) {
      this.editionService.curentBorderColor = this.editionService.defaultBorderColor;
    }
    if (this.editionService.defaultInsideColor != undefined) {
      this.editionService.curentColor = this.editionService.defaultInsideColor;
    }

  }

  /**
   * Set the current preview imageUrl according to the given file 'file' and close the chooseImage panel
   * if the initial image is bigger than 1000*1000 the the image is reduced
   *
   * @param file, a file element
   */
  previewFile(file) {
    this.editionService.imageURL = 'assets/icons/load.gif';
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
        this.editionService.imageURL = reader.result;
        // this.choseImage = false;
      };
    }, () => {
      reader.readAsDataURL(file[0]);
      reader.onload = () => {
        this.previewWithURL(reader.result);

      };
    });
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
   * Set the current preview imageUrl with the image string Url 't' and close the chooseImage panel
   *
   * @param t, the new imageUrl
   */
  previewWithURL(t) {
    this.editionService.imageURL = t;
    // this.choseImage = false;
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
      console.log('assets/libs/FR_Noir_et_blanc_pictogrammes/' + t + '.png');
      this.previewWithURL('assets/libs/FR_Noir_et_blanc_pictogrammes/' + t + '.png');
    }
  }

  previewLibrary(elt: { lib, word }) {
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

  cleanString(t: string) {
    return t.replace(/'/g, '\\\'');
  }

  /**
   * Return the list of 100 first mullberry library images, sorted by length name, matching with string 'text'
   *
   * @param text, the string researched text
   * @return list of 100 mulberry library images
   */

  /*
  *
  * */

  searchInLib(text: string) {
    this.editionService.imageTextField = text;
    this.imageList = [];
    let tempList = [];

    if(this.configurationService.LANGUAGE_VALUE === 'FR') {
      (arasaacJson as unknown as ArasaacObject)[0].wordList.forEach(word => {
        if (text !== null && text !== '' && word.toLowerCase().includes(text.toLocaleLowerCase()) && this.getSimilarity(text.toLowerCase(), word.toLowerCase()) >= 0.5) {
          console.log(word + "; " + text + "; " + this.getSimilarity(text, word));
          const url = word;
          tempList.push({lib: 'arasaacNB', word: this.cleanString(url)});
        }
      }, this);

      (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.forEach(word => {
        if (text !== null && text !== '' && word.toLowerCase().includes(text.toLocaleLowerCase()) && this.getSimilarity(text.toLowerCase(), word.toLowerCase()) >= 0.5) {
          console.log(word + "; " + text + "; " + this.getSimilarity(text, word));
          const url = word;
          tempList.push({lib: 'arasaacColor', word: this.cleanString(url)});
        }
      }, this);
    }
    else{
      (mullberryJson as unknown as MulBerryObject[]).forEach(value => {
        if (text !== null && text !== '' && value.symbol.toLowerCase().includes(text.toLocaleLowerCase()) && this.getSimilarity(text.toLowerCase(), value.symbol.toLowerCase()) >= 0.5) {
          console.log(value.symbol + "; " + text + "; " + this.getSimilarity(text, value.symbol));
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

  /*s can be 'inside' or 'border', used to open the corresponding color picker popup  */
  openDialogModifyInside() {
    this.dialog.open(DialogModifyColorInsideComponent, {
      height: '50%',
      width: '60%'
    });
  }

  openDialogModifyBorder() {
    this.dialog.open(DialogModifyColorBorderComponent, {
      height: '50%',
      width: '60%'
    });
  }


  private _filter(value: string): string[] {
    if(value.length > 1){
      this.wordList = [];
      this.searchInLib(value);
      return this.wordList;
    }
  }
}
