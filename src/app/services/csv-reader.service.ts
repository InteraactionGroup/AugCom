import {Injectable} from '@angular/core';
import jsonSpeak4Yourself from '../../assets/csvjson.json';
import {CSVRecord} from '../csvType';
import {FolderGoTo, Grid} from '../types';

@Injectable({
  providedIn: 'root'
})
export class CsvReaderService { //TODO modify this class for new file format with Path

  speak4Yourself: CSVRecord[];

  constructor() {
    this.speak4Yourself = jsonSpeak4Yourself;
  }

  getFolder(element: CSVRecord) {
    if (element.page === 'HOME') {
      return '';
    } else {
      const parentPage = this.speak4Yourself.find(elt => elt.mot === element.page);
      if (parentPage != null) {
        return this.getFolder(parentPage) + '.' + parentPage.id;
      } else {
        return '.' + element.id;
      }
    }
  }


  elementIsFolder(element: CSVRecord): boolean {
    return (this.speak4Yourself.findIndex(compElt => compElt.page === element.mot) !== -1) && element.mot !== element.page;
  }

  generateBoard() {
    const grille: Grid = new Grid('speak4yourself', 'grid', 12, 12, [], [], []);
    this.speak4Yourself.forEach(element => {

      let folder = '';
      if (element.page === 'HOME') {
        folder = '#HOME';
      } else {
        folder = this.getFolder(element);
      }

      const isFolder = this.elementIsFolder(element);
      grille.ElementList.push({
        ID: '' + element.id,
        Type: isFolder ? new FolderGoTo(element.id) : 'button',
        PartOfSpeech: '',
        ElementFormsList: [{
          DisplayedText: element.mot,
          VoiceText: element.mot,
          LexicInfos: [{default: true}],
          ImageID: ''
        }],
        InteractionsList: [{
          ID: 'click',
          ActionList: [{ID: 'say', Action: 'say'}, {ID: 'display', Action: 'display'}]
        }],
        Color: isFolder ? '#fda728' : '#fde498',
        BorderColor: 'black',
        VisibilityLevel: 0
      });
    });

    // grille.ElementList.forEach( elt => {
    //   elt.ElementForms[0].DisplayedText =
    // });

    let maxCol = 0;
    let maxRow = 0;

    this.speak4Yourself.forEach(elt => {
      maxCol = elt.colonne > maxCol ? elt.colonne : maxCol;
      maxRow = elt.ligne > maxRow ? elt.ligne : maxRow;
    });

    console.log(maxCol + ' ; ' + maxRow);

    grille.NumberOfRows = maxRow + 1;
    grille.NumberOfCols = maxCol;

    return grille;
  }
}
