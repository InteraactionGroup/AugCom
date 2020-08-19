import {Injectable} from '@angular/core';
import jsonSpeak4Yourself from '../../assets/csvjson.json';
import {CSVRecord} from '../csvType';
import {FolderGoTo, Grid, GridElement} from '../types';
import {IndexeddbaccessService} from './indexeddbaccess.service';
import {Router} from '@angular/router';
import {BoardService} from './board.service';
import {JsonValidatorService} from './json-validator.service';

@Injectable({
  providedIn: 'root'
})
export class SpeakForYourselfParser {

  speak4Yourself: CSVRecord[];

  constructor(public indexedDBacess: IndexeddbaccessService, public jsonValidator: JsonValidatorService,
              private router: Router, public boardService: BoardService) {
    this.speak4Yourself = jsonSpeak4Yourself;
  }

  createGridSpeak4YourselfCSV() {
    this.boardService.board = this.jsonValidator.getCheckedGrid(this.createGrid());
    this.indexedDBacess.update();
    this.router.navigate(['']);
  }

  elementIsFolder(element: CSVRecord): boolean {
    return (this.speak4Yourself.findIndex(compElt => compElt.page === element.mot) !== -1) && (element.mot !== element.page);
  }

  createGrid() {
    const grille: Grid = new Grid('speak4yourself', 'Grid', 12, 12, [], [], []);
    this.speak4Yourself.forEach(element => {

      if (element.page === 'HOME') {
        element.page = '#HOME';
      }

      if (grille.PageList.findIndex(page => {
        return page.ID === element.page
      }) === -1) {
        grille.PageList.push({
          ID: element.page,
          Name: element.page,
          ElementIDsList: []
        });
      }

      const isFolder = this.elementIsFolder(element);

      const parentPage = grille.PageList.find(page => {
        return page.ID === element.page
      });
      if (parentPage !== null && parentPage !== undefined) {
        const index = (element.ligne - 1) * 15 + (element.colonne - 1);
        parentPage.ElementIDsList[index] = element.mot + (isFolder ? '' : 'button');
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
          ActionList: [{ID: 'say', Options: []}, {ID: 'display', Options: []}]
        }],
        Color: isFolder ? '#fda728' : '#fde498',
        BorderColor: 'black',
        VisibilityLevel: 0,
        x: 0,
        y: 0,
        rows: 1,
        cols: 1,
        dragAndResizeEnabled: true
      });
    });

    grille.PageList.forEach(page => {
      for (let i = 0; i < page.ElementIDsList.length; i++) {
        if (page.ElementIDsList[i] === undefined || page.ElementIDsList[i] === null) {
          page.ElementIDsList[i] = '#disable';
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
