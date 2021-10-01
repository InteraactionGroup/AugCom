import {Component, OnInit} from '@angular/core';
import {EditionService} from '../../services/edition.service';
import {Ng2ImgMaxService} from 'ng2-img-max';
import mullberryJson from '../../../assets/symbol-info.json';
import arasaacJson from '../../../assets/arasaac-symbol-info.json';
import arasaacColoredJson from '../../../assets/arasaac-color-symbol-info.json';
import {ArasaacObject, MulBerryObject} from '../../libTypes';
import {MultilinguismService} from '../../services/multilinguism.service';
import {DialogAddUserComponent} from "../dialog-add-user/dialog-add-user.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogModifyColorInsideComponent} from "../dialog-modify-color-inside/dialog-modify-color-inside.component";
import {DialogModifyColorBorderComponent} from "../dialog-modify-color-border/dialog-modify-color-border.component";

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


  constructor(public multilinguism: MultilinguismService,
              public ng2ImgMaxService: Ng2ImgMaxService,
              public editionService: EditionService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
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
      this.previewMullberry(elt.word);
    } else if (elt.lib === 'arasaacNB') {
      this.previewArasaac(elt.word, false);
    } else if (elt.lib === 'arasaacColor') {
      this.previewArasaac(elt.word, true);
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

    (arasaacJson as unknown as ArasaacObject)[0].wordList.forEach(word => {
      if (text !== null && text !== '' && word.toLowerCase().includes(text.toLocaleLowerCase())) {
        const url = word;
        tempList.push({lib: 'arasaacNB', word: this.cleanString(url)});
      }
    }, this);

    (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.forEach(word => {
      if (text !== null && text !== '' && word.toLowerCase().includes(text.toLocaleLowerCase())) {
        const url = word;
        tempList.push({lib: 'arasaacColor', word: this.cleanString(url)});
      }
    }, this);

    (mullberryJson as unknown as MulBerryObject[]).forEach(value => {
      if (text !== null && text !== '' && value.symbol.toLowerCase().includes(text.toLocaleLowerCase())) {
        const url = value.symbol;
        tempList.push({lib: 'mulberry', word: this.cleanString(url)});
      }
    }, this);

    tempList = tempList.sort((a: { lib, word }, b: { lib, word }) => {
      return a.word.length - b.word.length;
    });

    this.imageList = tempList.slice(0, 100);
  }

  /*s can be 'inside' or 'border', used to open the corresponding color picker popup  */
  pickAColor(s: string) {
    this.editionService.colorPicked = s;
  }

  openDialogModifyInside() {
    this.editionService.colorPicked = 'inside';
    this.dialog.open(DialogModifyColorInsideComponent, {
      height: '50%',
      width: '60%'
    });
  }

  openDialogModifyBorder() {
    this.editionService.colorPicked = 'border';
    this.dialog.open(DialogModifyColorBorderComponent, {
      height: '50%',
      width: '60%'
    });
  }


}
