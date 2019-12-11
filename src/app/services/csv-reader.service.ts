import { Injectable } from '@angular/core';
import jsonSpeak4Yourself from '../../assets/csvjson.json';
import {CSVRecord} from '../csvType';
import {Action, ElementForm, Grid} from '../types';
import {DbnaryService} from './dbnary.service';
import {Traduction} from '../sparqlJsonResults';

@Injectable({
  providedIn: 'root'
})
export class CsvReaderService {

  speak4Yourself: CSVRecord[];

  constructor(private dbNaryService: DbnaryService) {
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
        return  '.' + element.id;
      }
    }
  }


  elementIsFolder(element: CSVRecord): boolean {
    return (this.speak4Yourself.findIndex(compElt => compElt.page === element.mot) !== -1) && element.mot !== element.page;
  }

  generateBoard() {
    const grille: Grid = new Grid('speak4yourself', [], [], [], 'grid', [12], [12], null);
    this.speak4Yourself.forEach(element => {

      let folder = '';
      if (element.page === 'HOME') {
        folder = '.';
      } else {
        folder = this.getFolder(element);
      }

      const isFolder = this.elementIsFolder(element);
      grille.ElementList.push({
        ElementID: '' + element.id,
      ElementFolder: folder,
      ElementType: isFolder ? 'folder' : 'button',
      ElementPartOfSpeech: '',
      ElementForms: [{
          DisplayedText: element.mot,
          VoiceText: element.mot,
          LexicInfos: [{default: true}]
        }],
      ImageID: '',
      InteractionsList: [{ InteractionID: 'click',
        ActionList: [ {ActionID: 'say', Action: 'say'}, {ActionID: 'display', Action: 'display'}] }],
      Color: isFolder ? '#fda728' : '#fde498',
      BorderColor: 'black',
      Visible: true
      });
    });

    // grille.ElementList.forEach( elt => {
    //   elt.ElementForms[0].DisplayedText =
    // });

    let maxCol = 0;
    let maxRow = 0;

    this.speak4Yourself.forEach( elt => {
      maxCol = elt.colonne > maxCol ? elt.colonne : maxCol;
      maxRow = elt.ligne > maxRow ? elt.ligne : maxRow;
    });

    console.log(maxCol + ' ; ' + maxRow);

    grille.gridRowsNumber = maxRow + 1 ;
    grille.gridColsNumber = maxCol;

    return grille;
  }
}
