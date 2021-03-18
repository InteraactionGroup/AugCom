import {Component, OnInit} from '@angular/core';
import {MultilinguismService} from '../../services/multilinguism.service';
import {Grid, GridElement, Image, Page} from '../../types';
import {BoardService} from '../../services/board.service';
import {Router} from '@angular/router';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {ConfigurationService} from '../../services/configuration.service';
import {SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-spb2aug',
  templateUrl: './spb2aug.component.html',
  styleUrls: ['./spb2aug.component.css']
})
// doc sqlite : https://github.com/sql-js/sql.js/
export class Spb2augComponent implements OnInit {

  constructor(
    public multilinguism: MultilinguismService,
    public indexedDBacess: IndexeddbaccessService,
    public router: Router,
    public boardService: BoardService,
    public configuration: ConfigurationService) {
  }
  newGrid: Grid;
  page : Page;
  gridElement: GridElement;
  rowCounts: number[];
  NumberOfCols: number;
  NumberOfRows: number;
  db = null;
  pageHome: number;
  newPage: Page;

  myBlob: Blob;
  myFile: File;
  im: SafeUrl;

  ngOnInit(): void {
    this.newGrid = new Grid('newGrid','Grid',0,0,[],[],[]);
    this.page = new Page();
    this.page.ID = '#HOME';
    this.page.Name = 'Accueil';
    this.page.ElementIDsList = [];
    this.pageHome = 4;
  }
  convert(file){
    this.newGrid.ID = 'newGrid';
    this.newGrid.GapSize = 5;
    const myFile = file[0];
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.loadDB(fileReader);
    };
    fileReader.readAsArrayBuffer(myFile);
  }
  loadDB(arrayBuffer) {
    // initSqlJs is in the library sql.js, use npm install @types/sql.js
    initSqlJs().then(SQL => {
      let tables;
      try {
        this.db = new SQL.Database(new Uint8Array(arrayBuffer.result));
        // Get all table names from master table
        tables = this.db.prepare('SELECT * FROM sqlite_master WHERE type=\'table\' ORDER BY name');
      } catch (ex) {
        alert(ex);
        return;
      }
      let firstTableName = null;
      let columnTypes = [];
      while (tables.step()) {
        const rowObj = tables.getAsObject();
        const name = rowObj.name;

        if (firstTableName === null) {
          firstTableName = name;
        }

        if (name === 'Button'){
          this.getElement(name);
        }
        if (name === 'ElementPlacement'){
          this.NumberOfCols = 0;
          this.NumberOfRows = 0;
          if (name != null) {
            columnTypes = this.getTableColumnTypes(name);
            this.getGridDimension(name);
          }
        }
        if (name === 'PageSetProperties') {
          this.getPolice(name);
        }
      }
      console.log(this.newGrid);
      this.boardService.board = this.newGrid;
      this.indexedDBacess.update();
      this.router.navigate(['']);
    });
  }
  getTableRowsCount(name): number {
    const cell = this.db.prepare('SELECT COUNT(*) AS count FROM \'' + name + '\'');
    if (cell.step()) {
      return cell.getAsObject().count;
    } else {
      return -1;
    }
  }
  getTableColumnTypes(tableName) {
    const result = [];
    const sel = this.db.prepare('PRAGMA table_info(\'' + tableName + '\')');

    while (sel.step()) {
      const obj = sel.getAsObject();
      result[obj.name] = obj.type;
    }
    return result;
  }
  getElement(name){
    const cel = this.db.prepare('SELECT * FROM \'' + name + '\'');
    const elReference = this.db.prepare('SELECT * FROM ElementReference');
    const elPlacement = this.db.prepare('SELECT * FROM \'ElementReference\' INNER JOIN \'ElementPlacement\' ON ElementReference.Id = ElementPlacement.ElementReferenceId ORDER BY ID');
    const buttonsFolder = this.db.prepare('SELECT * FROM ButtonPageLink');
    const buttonPage = this.db.prepare('SELECT ButtonId, Button.Label, Button.ElementReferenceId as ButtonElementRenceID, PageUniqueId, Page.Id, ElementPlacement.ElementReferenceId as ElementReferenceIdOfChild, ElementPlacement.GridPosition as ChildPosition, ElementPlacement.GridSpan as ChildSpan FROM \'Button\' JOIN \'ButtonPageLink\' ON Button.Id = ButtonPageLink.ButtonId JOIN \'PAGE\' ON ButtonPageLink.PageUniqueId = Page.UniqueID JOIN PageLayout ON PageId = Page.Id JOIN ElementPlacement ON PageLayoutId = PageLayout.ID ORDER BY ButtonId ASC');
    // skip the first because we don't care about it
    elReference.step();
    buttonsFolder.step();
    elPlacement.step();
    // cel.step itère sur les ligne une à une
    while (cel.step()){
      elPlacement.step();
      elReference.step();

      const pageSetImageId = elPlacement.getAsObject().PageSetImageId;
      if(pageSetImageId !== 0){
        // this.getImage();
      }

      const buttonFolder = Number(buttonsFolder.getAsObject().ButtonId);
      const buttonId = Number(cel.getAsObject().Id);

      const gridPosition = elPlacement.getAsObject().GridPosition;
      const color = Number(elPlacement.getAsObject().BackgroundColor);
      const borderColor = Number(cel.getAsObject().BorderColor);

      const B_MASK = 255;
      const G_MASK = 255<<8; // 65280
      const R_MASK = 255<<16; // 16711680
      const r = (color & R_MASK)>>16;
      const g = (color & G_MASK)>>8;
      const b = color & B_MASK;

      const rb = (borderColor & R_MASK)>>16;
      const gb = (borderColor & G_MASK)>>8;
      const bb = borderColor & B_MASK;

      const gridSpan = elPlacement.getAsObject().GridSpan;
      const tabResPos = gridPosition.split(',');
      const tabResSpan = gridSpan.split(',');
      const label: string = cel.getAsObject().Label;
      const message: string = cel.getAsObject().Message;

      const pageId = elReference.getAsObject().PageId;

      // check if the button is a folder button to bind him
      if(buttonId === buttonFolder){
        this.gridElement = new GridElement(label, {GoTo : label}, '', 'rgb('+r+','+g+','+b+')', 'rgb('+rb+','+gb+','+bb+')'
          , 1,
          [
            {
              DisplayedText: label,
              VoiceText: (message) !== null ? message : label,
              LexicInfos: [{default: true}],
              ImageID: label,
            }
          ], [{ID: 'click', ActionList: [{ID: 'display', Options: []},{ID: 'say', Options: []}]}])
        buttonsFolder.step();
        this.newPage = new Page();
        this.newPage.ID = label;
        this.newPage.Name = label;
        this.newPage.ElementIDsList = [];
        this.newGrid.PageList.push(this.newPage);
      }
      else {
        this.gridElement = new GridElement(label, 'button', '', 'rgb(' + r + ',' + g + ',' + b + ')', 'rgb(' + rb + ',' + gb + ',' + bb + ')'
          , 1,
          [
            {
              DisplayedText: label,
              VoiceText: (message) !== null ? message : label,
              LexicInfos: [{default: true}],
              ImageID: label,
            }
          ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
      }
      this.gridElement.x = Number(tabResPos[0]);
      this.gridElement.y = Number(tabResPos[1]);
      this.gridElement.rows = Number(tabResSpan[1]);
      this.gridElement.cols = Number(tabResSpan[0]);
      this.newGrid.ElementList.push(this.gridElement);
      this.getPageHome(pageId,label);
      this.newGrid.ImageList.push({
        ID: label,
        OriginalName: label,
        Path: '',
        });
    }
    this.newGrid.PageList.push(this.page);
    this.getMainPageDimension();
    this.getPageFolderButtons(buttonPage);
    this.nextPage();
  }
  getPageFolderButtons(buttonPage: any){
    while(buttonPage.step()) {
      const elementReferenceOfChild = Number(buttonPage.getAsObject().ElementReferenceIdOfChild);
      const labelFolder = String(buttonPage.getAsObject().Label);
      const index = this.newGrid.PageList.findIndex(page => page.Name === labelFolder);
      this.newGrid.PageList[index].ElementIDsList.push(this.newGrid.ElementList[elementReferenceOfChild - 2].ID);
      const pageId = Number(buttonPage.getAsObject().Id);
      const pageLayout = this.db.prepare('SELECT * FROM PageLayout WHERE PageId = ' + pageId);
      pageLayout.step();
      const pageLayoutSetting = pageLayout.getAsObject().PageLayoutSetting;
      const tabLayoutSetting = pageLayoutSetting.split(',');
      this.newGrid.PageList[index].NumberOfRows = Number(tabLayoutSetting[0]);
      this.newGrid.PageList[index].NumberOfCols = Number(tabLayoutSetting[1]);
    }
  }
  getGridDimension(name) {
    const cel = this.db.prepare('SELECT GridPosition,GridSpan FROM ' + name + ' ORDER BY ElementReferenceId ASC');
    while (cel.step()) {
      const result = cel.getAsObject().GridPosition;
      const gridSpan = cel.getAsObject().GridSpan;
      const tabPos = result.split(',');
      const tabSpan = gridSpan.split(',');
      const currentElementCol = Number(tabPos[0])+Number(tabSpan[0]);
      const currentElementRow = Number(tabPos[1])+Number(tabSpan[1]);
      if(this.NumberOfCols < currentElementCol){
        this.NumberOfCols = currentElementCol;
      }
      if(this.NumberOfRows < currentElementRow){
        this.NumberOfRows = currentElementRow;
      }
    }
    this.newGrid.NumberOfCols = this.NumberOfCols;
    this.newGrid.NumberOfRows = this.NumberOfRows;
  }
  getMainPageDimension(){
    const pageLayout = this.db.prepare('SELECT * FROM PageLayout WHERE PageId = 4');
    pageLayout.step();
    const pageLayoutSetting = pageLayout.getAsObject().PageLayoutSetting;
    const tabLayoutSetting = pageLayoutSetting.split(',');
    const length = this.newGrid.PageList.length;
    this.newGrid.PageList[length-1].NumberOfRows = Number(tabLayoutSetting[0]);
    this.newGrid.PageList[length-1].NumberOfCols = Number(tabLayoutSetting[1]);
  }
  getPolice(name){
    const po = this.db.prepare('SELECT * FROM \'' + name + '\'');
    po.step();
    const police = po.getAsObject().FontFamily;
    this.configuration.DEFAULT_STYLE_FONTFAMILY_VALUE = String(police);
  }
  getPageHome(pageId: any, label: string){
    if (pageId === this.pageHome) {
      this.page.ElementIDsList.push(label);
    }
  }
  nextPage(){
    // faire varier le numeroPage par la suite
    const numeroPage = 0;
    let nextPages: Page = new Page();
    nextPages.ElementIDsList = [];
    this.newGrid.PageList.forEach(page => {
      if(page.ElementIDsList.length > page.NumberOfRows*page.NumberOfCols){
        nextPages.Name = page.Name + numeroPage;
        nextPages.ID = page.Name + numeroPage;
        nextPages.NumberOfCols = page.NumberOfCols;
        nextPages.NumberOfRows = page.NumberOfRows;
        page.ElementIDsList.forEach(element => {
          // + 2 car il faut 1 pour donner une place au bouton descendre et 1 parce qu'il commence à 0
          if(page.ElementIDsList.indexOf(element) + 2 > page.NumberOfRows*page.NumberOfCols){
            nextPages.ElementIDsList.push(page.ElementIDsList[page.ElementIDsList.indexOf(element)]);
            page.ElementIDsList = page.ElementIDsList.filter(elementValue =>
              elementValue !== page.ElementIDsList[page.ElementIDsList.indexOf(element)]
            );
          }
        });
        // bouton pour descendre
        this.gridElement = new GridElement('goDown', {GoTo : nextPages.Name}, '', '', ''
          , 1,
          [
            {
              DisplayedText: '',
              VoiceText: '',
              LexicInfos: [{default: true}],
              ImageID: '',
            }
          ], [{ID: 'click', ActionList: [{ID: 'display', Options: []},{ID: 'say', Options: []}]}])
        this.gridElement.cols = 1;
        this.gridElement.rows = 1;
        this.gridElement.x = this.newGrid.NumberOfRows - 1;
        this.gridElement.y = this.newGrid.NumberOfCols - 1;
        this.newGrid.ElementList.push(this.gridElement);
        page.ElementIDsList.push(this.gridElement.ID);
        this.newGrid.PageList.push(nextPages);
        nextPages = new Page();
        nextPages.ElementIDsList = [];
        nextPages.NumberOfCols = page.NumberOfCols;
        nextPages.NumberOfRows = page.NumberOfRows;
      }
    });
  }
  getImage(){
    const im = this.db.prepare('SELECT * FROM PageSetData');
    im.step();
    const imageData = im.getAsObject().Data;
    this.myBlob = new Blob(imageData, {type: 'image/wmf'});
    this.myFile = this.blobToFile(this.myBlob,'chat.wmf');
    console.log('file :' + this.myFile);
  }
  blobToFile(theBlob: Blob, fileName:string): File{
    const b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return b as File;
  }
}
