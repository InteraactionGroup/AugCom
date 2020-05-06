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

          csvLink.page = csvLink.page.replace('accueil','#HOME');
          csvLink.id = csvLink.id.replace('accueil','#HOME');

          this.links.push(csvLink);

        } else {
          let csvRecord: CSVRecord2 = new CSVRecord2();
          csvRecord.mot = curruntRecord[0].trim();
          csvRecord.ligne = Number(curruntRecord[1].trim());
          csvRecord.colonne = Number(curruntRecord[2].trim());
          csvRecord.page = curruntRecord[3].trim();
          csvRecord.id = curruntRecord[4].trim();

          csvRecord.page = csvRecord.page.replace('accueil','#HOME');
          csvRecord.id = csvRecord.id.replace('accueil','#HOME');

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
    let tempElement: GridElement[] = [];
    let tempPage: Page[] = [];

    this.links.forEach( link => {
      let theoreticalId = link.page.split('@')[0];
      if (theoreticalId !== link.id
        && theoreticalId !== 'retour'
        && theoreticalId !== 'plus'
        && theoreticalId !== 'page_suivante'
        && theoreticalId !== 'page_précédente') {
        this.records.forEach( rec => {
          if (rec.page === link.id){
            rec.page = theoreticalId;
          }
        });
        link.id = theoreticalId;
      } else if (theoreticalId !== link.id
        && (theoreticalId === 'retour'
        || theoreticalId === 'page_suivante'
          || theoreticalId === 'plus'
        || theoreticalId === 'page_précédente')){
        this.records.forEach( rec => {
          if (rec.id === link.page){
            rec.id = link.id + '@' + link.page.split('@')[1];
          }
        });
        link.page = link.id + '@' + link.page.split('@')[1];
      }
    });

    this.links.forEach( link => {
      if(tempPage.findIndex( page => page.ID === link.id) === -1)
     { tempPage.push({
        ID: link.id,
        ElementIDsList: []
      })}
    });

    const interList: Interaction[] = [
      {ID: 'click', ActionList: [ {ID: 'display', Action: 'display'},{ID: 'say', Action: 'say'}]}
    ];

    this.records.forEach( record => {
      let isFolder =  this.links.findIndex( link => {return link.page === record.id}) !== -1;

      let id = record.id.split('@')[0]+ (isFolder ? '' : 'button');

      let parentPage = tempPage.find( page => {return page.ID === record.page});
      if (parentPage !== null && parentPage !== undefined){
        let index = (record.ligne - 1) * 8 + (record.colonne - 1);
        parentPage.ElementIDsList[index]=id;
      }

      let index = tempElement.findIndex( elt => {return elt.ID === id});

      if(index === -1) {
        console.log('added');
        tempElement.push(new GridElement(
          id,
          isFolder ? 'folder' : 'button',
          '',
          record.mot === 'PLUS' ? 'lightgrey' :
            (record.mot === 'RETOUR' ? 'red' :
              (record.mot ==='PAGE SUIVANTE' ? 'green' : (record.mot ==='PAGE PRÉCÉDENTE'? 'yellow' :'white'))),
          'black',
          0,
          [{
            DisplayedText: record.mot,
            VoiceText: record.mot,
            LexicInfos: [{default: true}],
            ImageID: ''
          }],
          interList));
      }
    });


    //tempPage = tempPage.filter( page => { return page.ElementIDsList.length > 0});
    tempPage.forEach( page => {
      for(let i = 0; i < page.ElementIDsList.length; i++){
        if (page.ElementIDsList[i] === undefined || page.ElementIDsList[i] === null){
          console.log("hidden in page " + page.ID);
          page.ElementIDsList[i]= '#hidden';
        }
      }
    });

    tempElement.push(
      new GridElement(
      '#hidden',
      'button',
      '',
      'transparent', // to delete later
      'transparent', // to delete later
      0,
      [],
      [])
    );

    let grid = {
      ID: 'ProloquoGrid',
      Type: 'Grid',
      NumberOfCols: 8,
      NumberOfRows: 4,
      ElementList: tempElement,
      ImageList: [],
      PageList: tempPage
    };

    console.log(tempElement);
    console.log(tempPage);

    return grid;
  }

}
