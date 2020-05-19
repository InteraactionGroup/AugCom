import {Injectable} from '@angular/core';
import jsonSpeak4Yourself from '../../assets/csvjson.json';
import {CSVRecord} from '../csvType';
import {FolderGoTo, Grid,GridElement} from '../types';

@Injectable({
  providedIn: 'root'
})
export class SpeakForYourselfParser { //TODO modify this class for new file format with Path

  speak4Yourself: CSVRecord[];

  constructor() {
    this.speak4Yourself = jsonSpeak4Yourself;
  }

  elementIsFolder(element: CSVRecord): boolean {
    if ((this.speak4Yourself.findIndex(compElt => compElt.page === element.mot) !== -1) && (element.mot !== element.page) ){
      return true;
    }
    return false;
  }

  generateBoard() {
    const grille: Grid = new Grid('speak4yourself', 'grid', 12, 12, [], [], []);
    this.speak4Yourself.forEach(element => {

      if (element.page === 'HOME') {
        element.page = '#HOME';
      }

      if(grille.PageList.findIndex(page => {return page.ID === element.page}) === -1){
       grille.PageList.push({
        ID: element.page,
         Name: element.page,
        ElementIDsList: []
      });}

      let isFolder = this.elementIsFolder(element);

      let parentPage = grille.PageList.find(page => {return page.ID === element.page});
      if (parentPage !== null && parentPage !== undefined){
        let index = (element.ligne - 1) * 15 + (element.colonne - 1);
        parentPage.ElementIDsList[index]=element.mot + (isFolder ? '' : 'button');
      }

      grille.ElementList.push({
        ID: element.mot + (isFolder ? '' : 'button'),
        Type: isFolder ? new FolderGoTo(element.mot) : 'button',
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

    grille.PageList.forEach( page => {
      for(let i = 0; i < page.ElementIDsList.length; i++){
        if (page.ElementIDsList[i] === undefined || page.ElementIDsList[i] === null){
          page.ElementIDsList[i]= '#disable';
        }
      }
    });

    grille.ElementList.push(
      new GridElement(
        '#disable',
        'button',
        '',
        'transparent', // to delete later
        'transparent', // to delete later
        0,
        [],
        [])
    );

    grille.NumberOfRows = 8;
    grille.NumberOfCols = 15;

    return grille;
  }
}
