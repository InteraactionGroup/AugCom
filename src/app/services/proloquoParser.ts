import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {backLinksCSV, buttonLinksCSV, CSVRecord, pageLinksCSV, wordsCSV} from "../csvType";
import {ElementForm, FolderGoTo, Grid, GridElement, Image, Interaction, Page} from "../types";
import {BoardService} from "./board.service";
import {IndexeddbaccessService} from "./indexeddbaccess.service";
import {PrintService} from "./print.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ProloquoParser {

  constructor(private http: HttpClient, public boardService: BoardService, public indexedDBacess: IndexeddbaccessService, private printService: PrintService,
              private router: Router,) { }

  public words: wordsCSV[] = [];
  public pageLinks: pageLinksCSV[] = [];
  public  buttonLinks: buttonLinksCSV[] = [];
  public backLinks: backLinksCSV[] = [];

  public createGridFromProloquoCSVs(): void {
    /*WORD CSV DATA*/
    this.http.get('assets/libs/proloquo/proloquoMots.csv', { responseType: 'text' }).subscribe(wordData => {
      let csvRecordsArray = (<string>wordData).split(/\r\n|\n/);
      let headersRow = this.getHeaderArray(csvRecordsArray);
      this.getDataRecordsArrayFromWordsCSV(csvRecordsArray, headersRow.length);

      /*PAGE CSV DATA*/
      this.http.get('assets/libs/proloquo/proloquoPageLinks.csv', { responseType: 'text' }).subscribe(pageData => {
        let csvRecordsArray = (<string>pageData).split(/\r\n|\n/);
        let headersRow = this.getHeaderArray(csvRecordsArray);
        this.getDataRecordsArrayFromPageLinksCSV(csvRecordsArray, headersRow.length);

        /*BUTTON CSV DATA*/
        this.http.get('assets/libs/proloquo/proloquoButtonLinks.csv', { responseType: 'text' }).subscribe(buttonData => {
          let csvRecordsArray = (<string>buttonData).split(/\r\n|\n/);
          let headersRow = this.getHeaderArray(csvRecordsArray);
          this.getDataRecordsArrayFromButtonLinksCSV(csvRecordsArray, headersRow.length);

          /*BACK CSV DATA*/
          this.http.get('assets/libs/proloquo/proloquoBackLinks.csv', { responseType: 'text' }).subscribe(backData => {
            let csvRecordsArray = (<string>backData).split(/\r\n|\n/);
            let headersRow = this.getHeaderArray(csvRecordsArray);
            this.getDataRecordsArrayFromBackLinksCSV(csvRecordsArray, headersRow.length);

            this.boardService.board = this.createGrid();
            this.indexedDBacess.update();
            this.router.navigate(['']);
          });
        });
      });
    });
  }

  getDataRecordsArrayFromWordsCSV(csvRecordsArray: any, headerLength: any) {
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        let csvRecord: wordsCSV = new wordsCSV();
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
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        let csvRecord: pageLinksCSV = new pageLinksCSV();
        csvRecord.from = curruntRecord[0].trim();
        csvRecord.to = curruntRecord[1].trim();
        this.pageLinks.push(csvRecord);
      }
    }
  }

  getDataRecordsArrayFromButtonLinksCSV(csvRecordsArray: any, headerLength: any) {
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        let csvRecord: buttonLinksCSV = new buttonLinksCSV();
        csvRecord.from = curruntRecord[0].trim();
        csvRecord.to = curruntRecord[1].trim();
        this.buttonLinks.push(csvRecord);
      }
    }
  }

  getDataRecordsArrayFromBackLinksCSV(csvRecordsArray: any, headerLength: any) {
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        let csvRecord: backLinksCSV = new backLinksCSV();
        csvRecord.from = curruntRecord[0].trim();
        csvRecord.backID = curruntRecord[1].trim();
        csvRecord.to = curruntRecord[2].trim();
        this.backLinks.push(csvRecord);
      }
    }
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let i = 0; i < headers.length; i++) { headerArray.push(headers[i]); }
    return headerArray;
  }

  createGrid(){
    let tempElement: GridElement[] = [];
    let tempPage: Page[] = [];

    this.setUpTempPage(tempPage);

    this.words.forEach( word => {

      let getType: any = 'button';
      let getPage = this.pageLinks.find( pageLink => {return pageLink.from === word.wordID});
      if(getPage !== null && getPage !== undefined){
        getType = new FolderGoTo( getPage.to === 'accueil' ? '#HOME' : getPage.to);
      } else {
        getPage = this.buttonLinks.find( buttonLink => {return buttonLink.from === word.wordID});
        if(getPage !== null && getPage !== undefined){
          getType = new FolderGoTo( getPage.to === 'accueil' ? '#HOME' : getPage.to);
        }
      }

      let idOfWord = this.setUpID(word,getType);

      let getParentPage = tempPage.find( page => {return page.ID === word.page});
      if(getParentPage !== null && getParentPage !== undefined){
        getParentPage.ElementIDsList[(word.colonne-1) + (word.ligne-1) * 8] = idOfWord;
      }

      if(tempElement.findIndex(elt => elt.ID === idOfWord) ===-1){
        tempElement.push(this.setUpNewGridElement(idOfWord, getType, word));
      }

    });

    this.setUpHomeID(tempPage);

    tempElement.push(new GridElement('#disable','','','transparent','transparent',
      1,[],[]));

    this.setUpElementIDToDisable(tempPage);

    tempPage.forEach(page => {
      if(page.ElementIDsList.length===0){
        console.log(page.ID);
      }
    });

    return this.setUpNewGrid(tempElement, tempPage);
  }

  setUpID(word, getType){
    let name = word.wordID.split('@%')[0];
   // if (name === 'fermer' || name === 'plus' || name === 'retour' || name === 'page_suivante' || name === 'page_précédente') {
     name = name + word.wordID.split('@%')[1];
   // }
     name = name + (getType === 'button' ? 'button' : '');
     return name;
  }

  setUpTempPage(tempPage){
    this.words.forEach( word => {
      if(tempPage.findIndex( page => page.ID === word.page) === -1) {
        let name = word.page;

        let pageLink = this.pageLinks.find(pageLink => pageLink.to === word.page );

        if(pageLink !== undefined && pageLink !== null){
          let word = this.words.find( word => word.wordID === pageLink.from);
          if(word !== undefined && word !== null){
            name = word.mot;
          }
        } else {

          let buttonLink = this.buttonLinks.find(buttonLink => buttonLink.to === word.page );

          if(buttonLink !== undefined && buttonLink !== null){
            let word = this.words.find( word => word.wordID === buttonLink.from);
            if(word !== undefined && word !== null){
              name = word.mot;
            }
          }
        }

        tempPage.push({ID: word.page , Name:name, ElementIDsList: []})
      }
    });
  }

  setUpNewGridElement(idOfWord, type, word){

    const interList: Interaction[] = [
      {ID: 'click', ActionList: [ {ID: 'display', Action: 'display'},{ID: 'say', Action: 'say'}]}
    ];

    return {
      ID: idOfWord, Type: type, PartOfSpeech: '', Color: this.getColor(word.wordID), BorderColor: 'black', VisibilityLevel: 0,
      ElementFormsList: [
        { DisplayedText: word.mot,
          VoiceText: word.mot,
          LexicInfos: [{default: true}],
          ImageID: word.wordID
        }
      ],
      InteractionsList: interList
    };
  }

  setUpElementIDToDisable(tempPage){
    tempPage.forEach( page => {
      for(let i = 0; i < page.ElementIDsList.length ; i++){
        if (page.ElementIDsList[i] === undefined || page.ElementIDsList[i] === null){
          page.ElementIDsList[i]= '#disable';
        }
      }
    });
  }

  setUpHomeID(tempPage: Page[]){
    let homePage = tempPage.find(page => page.ID==='accueil');
    homePage.ID = "#HOME";
    homePage.Name = "ACCUEIL";
  }

  setUpNewGrid(tempElement, tempPage){
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

  getColor(wordID: string){
    let name = wordID.split('@%')[0];
    switch (name) {
      case 'fermer' : return 'darkgray';
      case 'plus' : return 'dimgrey';
      case 'retour' : return 'red';
      case 'page_suivante' : return 'yellow';
      case 'page_précédente' : return 'orange';
      default: return 'white';
    }

  }

}
