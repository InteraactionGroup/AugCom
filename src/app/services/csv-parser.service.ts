import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CSVLink, CSVRecord, CSVRecord2} from "../csvType";
import {ElementForm, Grid, GridElement, Image, Interaction, Page} from "../types";
import {BoardService} from "./board.service";
import {IndexeddbaccessService} from "./indexeddbaccess.service";
import {PrintService} from "./print.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class CsvParserService {

  constructor(private http: HttpClient, public boardService: BoardService, public indexedDBacess: IndexeddbaccessService, private printService: PrintService,
              private router: Router,) { }

  public records: CSVRecord2[] = [];
  public links: CSVLink[] = [];


  public requestLease(): void {
    this.http.get('assets/CanadianProloquo.csv', { responseType: 'text' })
      .subscribe(data => {
        this.uploadListener(data);
        this.boardService.board = this.createGrid();
        this.indexedDBacess.update();
        this.router.navigate(['']);
      });
  }

  uploadListener(csvData: string): void {

        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);


  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        if(curruntRecord[0].trim()==='' && curruntRecord[1].trim() ==='' && curruntRecord[2].trim() ===''){
          let csvLink: CSVLink = new CSVLink();
          csvLink.page = curruntRecord[3].trim();
          csvLink.id = curruntRecord[4].trim();
          this.links.push(csvLink);
        } else {
          let csvRecord: CSVRecord2 = new CSVRecord2();
          csvRecord.mot = curruntRecord[0].trim();
          csvRecord.ligne = Number(curruntRecord[1].trim());
          csvRecord.colonne = Number(curruntRecord[2].trim());
          csvRecord.page = curruntRecord[3].trim();
          csvRecord.id = curruntRecord[4].trim();
          this.records.push(csvRecord);
        }
      }
    }
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }
  createGrid(){
    let maxRowNumber = 0;
    let maxColNumber = 0;
    let tempElement: GridElement[] = [];
    let tempPage: Page[] = [];
    let tempPageRework: Page[] = [];

    this.links.forEach( link => {
      tempPage.push({
        ID: link.id,
        ElementIDsList: []
      })
    });

    this.records.forEach( record => {
      maxColNumber = record.colonne > maxColNumber ? record.colonne : maxColNumber;
      maxRowNumber = record.ligne > maxRowNumber ? record.ligne : maxRowNumber;

      let isButton =  this.links.findIndex( link => {return link.page === record.id}) !== -1;

      let associatedPage = tempPage.find( page => {return page.ID === record.page});
      if (associatedPage !== null && associatedPage !== undefined){
        associatedPage.ElementIDsList.push(record.id.split('@')[0]+ (isButton ? '' : 'button'));
      }

      let index = tempElement.findIndex( elt => {return elt.ID === (record.id.split('@')[0] + (isButton ? '' : 'button'))});
      if(index === -1) {
        console.log('added');
        tempElement.push(new GridElement(
          record.id.split('@')[0] + (isButton ? '' : 'button'),
          isButton ? 'folder' : 'button',
          '',
          'white',
          'black',
          0,
          [{
            DisplayedText: record.mot,
            VoiceText: record.mot,
            LexicInfos: [{default: true}],
            ImageID: ''
          }],
          []));
      }
    });

    // this.links.forEach( link => {
    //   let theoricalId = link.page.split('@')[0];
    //   if (theoricalId !== link.id) {
    //     console.log(theoricalId);
    //     let pageToModif = tempPage.find( page => {return page.ID === link.id});
    //     if (pageToModif !== null && pageToModif !== undefined)
    //     {pageToModif.ID = theoricalId;}
    //   }
    // });

    //tempPage = tempPage.filter( page => { return page.ElementIDsList.length > 0});


    let grid = {
      ID: 'ProloquoGrid',
      Type: 'Grid',
      NumberOfCols: maxColNumber,
      NumberOfRows: maxRowNumber,
      ElementList: tempElement,
      ImageList: [],
      PageList: tempPage
    };

    console.log(tempElement);
    console.log(tempPage);

    return grid;
  }

}
