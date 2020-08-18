import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {backLinksCSV, buttonLinksCSV, pageLinksCSV, wordsCSV} from '../csvType';
import {FolderGoTo, Grid, GridElement, Interaction, Page} from '../types';
import {BoardService} from './board.service';
import {IndexeddbaccessService} from './indexeddbaccess.service';
import {PrintService} from './print.service';
import {Router} from '@angular/router';
import {JsonValidatorService} from './json-validator.service';

@Injectable({
  providedIn: 'root'
})
export class ProloquoParser {

  constructor(private http: HttpClient, public boardService: BoardService, public indexedDBacess: IndexeddbaccessService, private printService: PrintService,
              private router: Router, public jsonValidator: JsonValidatorService) {
  }

  public words: wordsCSV[] = [];
  public pageLinks: pageLinksCSV[] = [];
  public buttonLinks: buttonLinksCSV[] = [];
  public backLinks: backLinksCSV[] = [];

  public createGridFromProloquoCSVs(): void {
    /*WORD CSV DATA*/
    this.http.get('assets/libs/proloquo/proloquoMots.csv', {responseType: 'text'}).subscribe(wordData => {
      const csvRecordsArray = (wordData as string).split(/\r\n|\n/);
      const headersRow = this.getHeaderArray(csvRecordsArray);
      this.getDataRecordsArrayFromWordsCSV(csvRecordsArray, headersRow.length);

      /*PAGE CSV DATA*/
      this.http.get('assets/libs/proloquo/proloquoPageLinks.csv', {responseType: 'text'}).subscribe(pageData => {
        const csvRecordsArray = (pageData as string).split(/\r\n|\n/);
        const headersRow = this.getHeaderArray(csvRecordsArray);
        this.getDataRecordsArrayFromPageLinksCSV(csvRecordsArray, headersRow.length);

        /*BUTTON CSV DATA*/
        this.http.get('assets/libs/proloquo/proloquoButtonLinks.csv', {responseType: 'text'}).subscribe(buttonData => {
          const csvRecordsArray = (buttonData as string).split(/\r\n|\n/);
          const headersRow = this.getHeaderArray(csvRecordsArray);
          this.getDataRecordsArrayFromButtonLinksCSV(csvRecordsArray, headersRow.length);

          /*BACK CSV DATA*/
          this.http.get('assets/libs/proloquo/proloquoBackLinks.csv', {responseType: 'text'}).subscribe(backData => {
            const csvRecordsArray = (backData as string).split(/\r\n|\n/);
            const headersRow = this.getHeaderArray(csvRecordsArray);
            this.getDataRecordsArrayFromBackLinksCSV(csvRecordsArray, headersRow.length);

            this.boardService.board = this.jsonValidator.getCheckedGrid(this.createGrid());
            this.indexedDBacess.update();
            this.router.navigate(['']);
          });
        });
      });
    });
  }

  getDataRecordsArrayFromWordsCSV(csvRecordsArray: any, headerLength: any) {
    for (let i = 1; i < csvRecordsArray.length; i++) {
      const curruntRecord = (csvRecordsArray[i] as string).split(',');
      if (curruntRecord.length == headerLength) {
        const csvRecord: wordsCSV = new wordsCSV();
        csvRecord.mot = curruntRecord[0].trim();
        csvRecord.ligne = Number(curruntRecord[1].trim());
        csvRecord.colonne = Number(curruntRecord[2].trim());
        csvRecord.page = curruntRecord[3].trim();
        csvRecord.wordID = curruntRecord[4].trim();
        this.words.push(csvRecord);
      }
    }
  }

  getDataRecordsArrayFromPageLinksCSV(csvRecordsArray: any, headerLength: any) {
    for (let i = 1; i < csvRecordsArray.length; i++) {
      const curruntRecord = (csvRecordsArray[i] as string).split(',');
      if (curruntRecord.length == headerLength) {
        const csvRecord: pageLinksCSV = new pageLinksCSV();
        csvRecord.from = curruntRecord[0].trim();
        csvRecord.to = curruntRecord[1].trim();
        this.pageLinks.push(csvRecord);
      }
    }
  }

  getDataRecordsArrayFromButtonLinksCSV(csvRecordsArray: any, headerLength: any) {
    for (let i = 1; i < csvRecordsArray.length; i++) {
      const curruntRecord = (csvRecordsArray[i] as string).split(',');
      if (curruntRecord.length == headerLength) {
        const csvRecord: buttonLinksCSV = new buttonLinksCSV();
        csvRecord.from = curruntRecord[0].trim();
        csvRecord.to = curruntRecord[1].trim();
        this.buttonLinks.push(csvRecord);
      }
    }
  }

  getDataRecordsArrayFromBackLinksCSV(csvRecordsArray: any, headerLength: any) {
    for (let i = 1; i < csvRecordsArray.length; i++) {
      const curruntRecord = (csvRecordsArray[i] as string).split(',');
      if (curruntRecord.length == headerLength) {
        const csvRecord: backLinksCSV = new backLinksCSV();
        csvRecord.from = curruntRecord[0].trim();
        csvRecord.backID = curruntRecord[1].trim();
        csvRecord.to = curruntRecord[2].trim();
        this.backLinks.push(csvRecord);
      }
    }
  }

  getHeaderArray(csvRecordsArr: any) {
    const headers = (csvRecordsArr[0] as string).split(',');
    const headerArray = [];
    for (let i = 0; i < headers.length; i++) {
      headerArray.push(headers[i]);
    }
    return headerArray;
  }

  createGrid() {
    const tempElement: GridElement[] = [];
    const tempPage: Page[] = [];

    this.setUpTempPage(tempPage);

    this.words.forEach(word => {

      let getType: any = 'button';
      let getPage = this.pageLinks.find(pageLink => {
        return pageLink.from === word.wordID
      });
      if (getPage !== null && getPage !== undefined) {
        getType = new FolderGoTo(getPage.to === 'accueil' ? '#HOME' : getPage.to);
      } else {
        getPage = this.buttonLinks.find(buttonLink => {
          return buttonLink.from === word.wordID
        });
        if (getPage !== null && getPage !== undefined) {
          getType = new FolderGoTo(getPage.to === 'accueil' ? '#HOME' : getPage.to);
        }
      }

      const idOfWord = this.setUpID(word, getType);

      const getParentPage = tempPage.find(page => {
        return page.ID === word.page
      });
      if (getParentPage !== null && getParentPage !== undefined) {
        getParentPage.ElementIDsList[(word.colonne - 1) + (word.ligne - 1) * 8] = idOfWord;
      }

      if (tempElement.findIndex(elt => elt.ID === idOfWord) === -1) {
        tempElement.push(this.setUpNewGridElement(idOfWord, getType, word));
      }

    });

    this.setUpHomeID(tempPage);

    tempElement.push(new GridElement('#disable', 'empty', '', 'transparent', 'transparent',
      1, [], []));

    this.setUpElementIDToDisable(tempPage);

    tempPage.forEach(page => {
      if (page.ElementIDsList.length === 0) {
        console.log('This page was empty: ' + page.ID);
      }
    });

    tempElement.forEach(elt => {
      if (elt.Type !== 'button' && elt.Type !== 'empty' && (elt.Type as FolderGoTo).GoTo === null && (elt.Type as FolderGoTo).GoTo === undefined) {
        console.log('ID: ' + elt.ID + '  Type:' + elt.Type);
      }
    });

    return this.setUpNewGrid(tempElement, tempPage);
  }

  setUpID(word, getType) {
    let name = word.wordID.split('@%')[0];
    // if (name === 'fermer' || name === 'plus' || name === 'retour' || name === 'page_suivante' || name === 'page_précédente') {
    name = name + word.wordID.split('@%')[1];
    // }
    name = name + (getType === 'button' ? 'button' : '');
    return name;
  }

  setUpTempPage(tempPage) {
    this.words.forEach(word => {
      if (tempPage.findIndex(page => page.ID === word.page) === -1) {
        let name = word.page;

        const pageLink = this.pageLinks.find(pageLink => pageLink.to === word.page);

        if (pageLink !== undefined && pageLink !== null) {
          const word = this.words.find(word => word.wordID === pageLink.from);
          if (word !== undefined && word !== null) {
            name = word.mot;
          }
        } else {

          const buttonLink = this.buttonLinks.find(buttonLink => buttonLink.to === word.page);

          if (buttonLink !== undefined && buttonLink !== null) {
            const word = this.words.find(word => word.wordID === buttonLink.from);
            if (word !== undefined && word !== null) {
              name = word.mot;
            }
          }
        }

        tempPage.push({ID: word.page, Name: name, ElementIDsList: []})
      }
    });
  }

  setUpNewGridElement(idOfWord, type, word) {

    const interList: Interaction[] = [
      {ID: 'click', ActionList: [{ID: 'display', Action: 'display'}, {ID: 'say', Action: 'say'}]}
    ];

    return {
      ID: idOfWord, Type: type, PartOfSpeech: '', Color: this.getColor(word.wordID), BorderColor: 'black', VisibilityLevel: 0,
      ElementFormsList: [
        {
          DisplayedText: word.mot,
          VoiceText: word.mot,
          LexicInfos: [{default: true}],
          ImageID: word.wordID
        }
      ],
      InteractionsList: interList,
      x: 0,
      y: 0,
      rows: 1,
      cols: 1
    };
  }

  setUpElementIDToDisable(tempPage) {
    tempPage.forEach(page => {
      for (let i = 0; i < page.ElementIDsList.length; i++) {
        if (page.ElementIDsList[i] === undefined || page.ElementIDsList[i] === null) {
          page.ElementIDsList[i] = '#disable';
        }
      }
    });
  }

  setUpHomeID(tempPage: Page[]) {
    const homePage = tempPage.find(page => page.ID === 'accueil');
    homePage.ID = '#HOME';
    homePage.Name = 'ACCUEIL';
  }

  setUpNewGrid(tempElement, tempPage): Grid {
    return {
      ID: 'ProloquoGrid',
      Type: 'Grid',
      NumberOfCols: 8,
      NumberOfRows: 4,
      ElementList: tempElement,
      ImageList: [],
      PageList: tempPage
    };
  }

  getColor(wordID: string) {
    const name = wordID.split('@%')[0];
    switch (name) {
      case 'fermer' :
        return 'darkgray';
      case 'plus' :
        return 'dimgrey';
      case 'retour' :
        return 'red';
      case 'page_suivante' :
        return 'yellow';
      case 'page_précédente' :
        return 'orange';
      default:
        return 'white';
    }

  }

}
