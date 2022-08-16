import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BackLinksCSV, ButtonLinksCSV, PageLinksCSV, WordsCSV} from '../csvType';
import {FolderGoTo, Grid, GridElement, Interaction, Page} from '../types';
import {BoardService} from './board.service';
import {IndexeddbaccessService} from './indexeddbaccess.service';
import {Router} from '@angular/router';
import {JsonValidatorService} from './json-validator.service';

@Injectable({
  providedIn: 'root'
})
export class ProloquoParser {

  constructor(public http: HttpClient,
              public boardService: BoardService,
              public indexedDBacess: IndexeddbaccessService,
              public router: Router,
              public jsonValidator: JsonValidatorService) {
  }

  public words: WordsCSV[] = [];
  public pageLinks: PageLinksCSV[] = [];
  public buttonLinks: ButtonLinksCSV[] = [];
  public backLinks: BackLinksCSV[] = [];

  public createGridFromProloquoCSVs(): void {
    /*WORD CSV DATA*/
    this.http.get('assets/libs/proloquo/proloquoMots.csv', {responseType: 'text'}).subscribe(wordData => {
      const csvWordRecordsArray = (wordData as string).split(/\r\n|\n/);
      const headerWord = this.getHeaderArray(csvWordRecordsArray);
      this.getDataRecordsArrayFromWordsCSV(csvWordRecordsArray, headerWord.length);

      /*PAGE CSV DATA*/
      this.http.get('assets/libs/proloquo/proloquoPageLinks.csv', {responseType: 'text'}).subscribe(pageData => {
        const csvPageRecordsArray = (pageData as string).split(/\r\n|\n/);
        const headerPage = this.getHeaderArray(csvPageRecordsArray);
        this.getDataRecordsArrayFromPageLinksCSV(csvPageRecordsArray, headerPage.length);

        /*BUTTON CSV DATA*/
        this.http.get('assets/libs/proloquo/proloquoButtonLinks.csv', {responseType: 'text'}).subscribe(buttonData => {
          const csvButtonRecordsArray = (buttonData as string).split(/\r\n|\n/);
          const headerButton = this.getHeaderArray(csvButtonRecordsArray);
          this.getDataRecordsArrayFromButtonLinksCSV(csvButtonRecordsArray, headerButton.length);

          /*BACK CSV DATA*/
          this.http.get('assets/libs/proloquo/proloquoBackLinks.csv', {responseType: 'text'}).subscribe(backData => {
            const csvBackRecordsArray = (backData as string).split(/\r\n|\n/);
            const headerBack = this.getHeaderArray(csvBackRecordsArray);
            this.getDataRecordsArrayFromBackLinksCSV(csvBackRecordsArray, headerBack.length);

            this.boardService.board = this.jsonValidator.getCheckedGrid(this.createGrid());
            this.indexedDBacess.update();
            this.router.navigate(['keyboard']);
          });
        });
      });
    });
  }

  getDataRecordsArrayFromWordsCSV(csvRecordsArray: any, headerLength: any) {
    for (let i = 1; i < csvRecordsArray.length; i++) {
      const curruntRecord = (csvRecordsArray[i] as string).split(',');
      if (curruntRecord.length === headerLength) {
        const csvRecord: WordsCSV = new WordsCSV();
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
      if (curruntRecord.length === headerLength) {
        const csvRecord: PageLinksCSV = new PageLinksCSV();
        csvRecord.from = curruntRecord[0].trim();
        csvRecord.to = curruntRecord[1].trim();
        this.pageLinks.push(csvRecord);
      }
    }
  }

  getDataRecordsArrayFromButtonLinksCSV(csvRecordsArray: any, headerLength: any) {
    for (let i = 1; i < csvRecordsArray.length; i++) {
      const curruntRecord = (csvRecordsArray[i] as string).split(',');
      if (curruntRecord.length === headerLength) {
        const csvRecord: ButtonLinksCSV = new ButtonLinksCSV();
        csvRecord.from = curruntRecord[0].trim();
        csvRecord.to = curruntRecord[1].trim();
        this.buttonLinks.push(csvRecord);
      }
    }
  }

  getDataRecordsArrayFromBackLinksCSV(csvRecordsArray: any, headerLength: any) {
    for (let i = 1; i < csvRecordsArray.length; i++) {
      const curruntRecord = (csvRecordsArray[i] as string).split(',');
      if (curruntRecord.length === headerLength) {
        const csvRecord: BackLinksCSV = new BackLinksCSV();
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
    for (const header of headers) {
      headerArray.push(header);
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
      if (elt.Type !== 'button' &&
        elt.Type !== 'empty' &&
        (elt.Type as FolderGoTo).GoTo === null &&
        (elt.Type as FolderGoTo).GoTo === undefined) {
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

        const pageLinkToWordPage = this.pageLinks.find(pageLinkOfpageLinks => pageLinkOfpageLinks.to === word.page);

        if (pageLinkToWordPage !== undefined && pageLinkToWordPage !== null) {
          const wordFrom = this.words.find(wordOfwords => wordOfwords.wordID === pageLinkToWordPage.from);
          if (wordFrom !== undefined && wordFrom !== null) {
            name = wordFrom.mot;
          }
        } else {

          const buttonLink = this.buttonLinks.find(buttonLinkOfbuttonLinks => buttonLinkOfbuttonLinks.to === word.page);

          if (buttonLink !== undefined && buttonLink !== null) {
            const wordFrom = this.words.find(wordOfwords => wordOfwords.wordID === buttonLink.from);
            if (wordFrom !== undefined && wordFrom !== null) {
              name = wordFrom.mot;
            }
          }
        }

        tempPage.push({ID: word.page, Name: name, ElementIDsList: []})
      }
    });
  }

  setUpNewGridElement(idOfWord, type, word) {

    const interList: Interaction[] = [
      {ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}
    ];

    return new GridElement(
      idOfWord,
      type,
      '',
      this.getColor(word.ID),
      'black',
      0,
      [
        {
          DisplayedText: word.mot,
          VoiceText: word.mot,
          LexicInfos: [{default: true}],
          ImageID: word.wordID
        }
      ],
      interList
    )
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
      author: "",
      creationDate: "",
      modificationDate: "",
      software: "AugCom",
      libraryUsed: [],
      licence: "",
      owner: "",
      translators: "",
      BackgroundColor: 'default',
      ID: 'ProloquoGrid',
      Type: 'Grid',
      NumberOfCols: 8,
      NumberOfRows: 4,
      GapSize: 5,
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
