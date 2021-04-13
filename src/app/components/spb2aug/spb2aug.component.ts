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
    this.getMainPageDimension();
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
      if(buttonId === buttonFolder && label !== null){
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
        this.newGrid.PageList.unshift(this.newPage);
      }
      else if (buttonId === buttonFolder && label === null){
        this.gridElement = new GridElement(String(buttonFolder),
          {GoTo : String(buttonFolder)},
          '', 'rgb('+r+','+g+','+b+')',
          'rgb('+rb+','+gb+','+bb+')',
          1,
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
        this.newPage.ID = String(buttonFolder);
        this.newPage.Name = String(buttonFolder);
        this.newPage.ElementIDsList = [];
        this.newGrid.PageList.unshift(this.newPage);
      }
      else {
        this.gridElement = new GridElement((label) !== null ? label : message,
          'button',
          '',
          'rgb(' + r + ',' + g + ',' + b + ')',
          'rgb(' + rb + ',' + gb + ',' + bb + ')',
          1,
          [
            {
              DisplayedText: (label) !== null ? label : message,
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
      this.getPageHome(pageId,this.gridElement);
      this.newGrid.ImageList.push({
        ID: label,
        OriginalName: label,
        Path: '',
        });
    }
    this.addColIfNeeded();
    this.newGrid.PageList.unshift(this.page);
    this.getPageFolderButtons(buttonPage);
    this.nextPage();
  }
  getPageFolderButtons(buttonPage: any){
    while(buttonPage.step()) {
      const elementReferenceOfChild = Number(buttonPage.getAsObject().ElementReferenceIdOfChild);
      const labelFolder = String(buttonPage.getAsObject().Label);
      const labelFolderId = String(buttonPage.getAsObject().ButtonId);
      let index = this.newGrid.PageList.findIndex(page => page.Name === labelFolder);
      if(index === -1){
        index = this.newGrid.PageList.findIndex(page => page.Name === labelFolderId);
      }
      const pageId = Number(buttonPage.getAsObject().Id);
      const pageLayout = this.db.prepare('SELECT * FROM PageLayout WHERE PageId = ' + pageId);
      pageLayout.step();
      const pageLayoutSetting = pageLayout.getAsObject().PageLayoutSetting;
      const childPositions = buttonPage.getAsObject().ChildPosition;
      const childPositionsXY = childPositions.split(',');
      const tabLayoutSetting = pageLayoutSetting.split(',');
      this.newGrid.PageList[index].NumberOfRows = Number(tabLayoutSetting[0]);
      this.newGrid.PageList[index].NumberOfCols = Number(tabLayoutSetting[1]);
      // on ajoute tout les boutons aux différentes pages des boutons (uniquement leur première page)
      if(Number(childPositionsXY[1]) < this.newGrid.PageList[index].NumberOfRows) {
        this.newGrid.PageList[index].ElementIDsList.push(this.newGrid.ElementList[elementReferenceOfChild - 2].ID);
      }
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
    this.page.NumberOfRows = Number(tabLayoutSetting[1]);
    this.page.NumberOfCols = Number(tabLayoutSetting[0]);
  }
  getPolice(name){
    const po = this.db.prepare('SELECT * FROM \'' + name + '\'');
    po.step();
    const police = po.getAsObject().FontFamily;
    this.configuration.DEFAULT_STYLE_FONTFAMILY_VALUE = String(police);
  }
  getPageHome(pageId: any, gridElement: GridElement){
    // -1 à cause des tableaux de l'enfer qui commencent à 0
    if (pageId === this.pageHome && gridElement.y <= this.page.NumberOfRows - 1) {
      this.page.ElementIDsList.push(gridElement.ID);
    }
  }
  nextPage(){
    let nextPages: Page = new Page();
    nextPages.ElementIDsList = [];
    let numeroPage = 1;
    let lastElementPageId: number;

    const gridPositionAndPageId = this.db.prepare('SELECT * FROM \'ElementPlacement\' INNER JOIN \'ElementReference\' ON ElementReference.Id = ElementPlacement.ElementReferenceId ORDER BY Id');
    let pageid = 4;
    gridPositionAndPageId.step();
    let gridPosition = gridPositionAndPageId.getAsObject().GridPosition;
    while(gridPositionAndPageId.step()) {
      const pageId = gridPositionAndPageId.getAsObject().PageId;
      if (pageid !== pageId) {
        const buttonPosition = gridPosition.split(',');
        const buttonRow = Number(buttonPosition[1]);
        // numberNewPage permet de connaitre le nombre de page à créer -1 puisque l'on créer déjà la première page en dehors
        const numberNewPage = Math.ceil(buttonRow / this.newGrid.PageList[pageid - 4].NumberOfRows) - 1;
        // condition pour les pages initiales
        if(numberNewPage > 0) {
          // création du bouton pour descendre dans la page d'origine quand il y a plusieurs pages
          this.gridElement = new GridElement('goDown' + this.newGrid.PageList[pageid - 4].ID + numeroPage,
            {GoTo: this.newGrid.PageList[pageid - 4].ID + numeroPage},
            '',
            '',
            '',
            1,
            [
              {
                DisplayedText: 'go Down',
                VoiceText: '',
                LexicInfos: [{default: true}],
                ImageID: '',
              }
            ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
          this.gridElement.cols = 1;
          this.gridElement.rows = 1;
          this.gridElement.y = this.page.NumberOfRows - 1;
          this.gridElement.x = this.page.NumberOfCols - 1;

          this.newGrid.ElementList.push(this.gridElement);
          this.newGrid.PageList[pageid - 4].ElementIDsList.push(this.gridElement.ID);

          // conditions pour les pages de page
          for (let i = 0; i < numberNewPage; i++) {
            nextPages = new Page();
            nextPages.ID = this.newGrid.PageList[pageid - 4].ID + numeroPage;
            nextPages.Name = this.newGrid.PageList[pageid - 4].Name + numeroPage;
            nextPages.ElementIDsList = [];
            nextPages.NumberOfRows = this.newGrid.PageList[pageid - 4].NumberOfRows;
            nextPages.NumberOfCols = this.newGrid.PageList[pageid - 4].NumberOfCols;

            // numberNewPage - 1 !== i car on ne veut pas de bouton descendre dans la dernière page
            if (numberNewPage - 1 !== i) {
              this.gridElement = new GridElement('goDown ' + this.newGrid.PageList[pageid - 4].ID + (numeroPage + 1),
                {GoTo: this.newGrid.PageList[pageid - 4].ID + (numeroPage + 1)},
                '',
                '',
                '',
                1,
                [
                  {
                    DisplayedText: 'go Down',
                    VoiceText: '',
                    LexicInfos: [{default: true}],
                    ImageID: '',
                  }
                ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
              this.gridElement.cols = 1;
              this.gridElement.rows = 1;
              this.gridElement.y = nextPages.NumberOfRows - 1;
              this.gridElement.x = nextPages.NumberOfCols - 1;
              this.newGrid.ElementList.push(this.gridElement);
              nextPages.ElementIDsList.push(this.gridElement.ID);
            }
            this.buttonsNewPages(nextPages, i, pageid);
            this.newGrid.PageList.push(nextPages);
            numeroPage = numeroPage + 1;
            lastElementPageId = pageId;
          }
        }
        pageid = pageId;
        numeroPage = 1;
      }
      gridPosition = gridPositionAndPageId.getAsObject().GridPosition;
    }
    // Traitement pour le dernier cas de la boucle while
    if(pageid !== 4 && pageid !== lastElementPageId){
      // on donne l'indice de la dernière page en rajoutant ce + 1 mais ne fonctionne qu'avec plusieurs page
      pageid = pageid + 1;
      const buttonPositionBis = gridPosition.split(',');
      const buttonRowBis = Number(buttonPositionBis[1]);
      // numberNewPage permet de connaitre le nombre de page à créer -1 puisque l'on créer déjà la première page en dehors
      const numberNewPageBis = Math.ceil(buttonRowBis / this.newGrid.PageList[pageid - 6].NumberOfRows) - 1;
      if(numberNewPageBis > 0) {
        // création du bouton pour descendre dans la page d'origine quand il y a plusieurs pages
        this.gridElement = new GridElement('goDown' + this.newGrid.PageList[pageid - 6].ID + numeroPage,
          {GoTo: this.newGrid.PageList[pageid - 6].ID + numeroPage},
          '',
          '',
          '',
          1,
          [
            {
              DisplayedText: 'go Down',
              VoiceText: '',
              LexicInfos: [{default: true}],
              ImageID: '',
            }
          ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
        this.gridElement.cols = 1;
        this.gridElement.rows = 1;
        this.gridElement.y = this.page.NumberOfRows - 1;
        this.gridElement.x = this.page.NumberOfCols - 1;
        this.newGrid.ElementList.push(this.gridElement);
        this.newGrid.PageList[pageid - 6].ElementIDsList.push(this.gridElement.ID);

        // conditions pour les pages de page
        for (let i = 0; i < numberNewPageBis; i++) {
          nextPages = new Page();
          nextPages.ID = this.newGrid.PageList[pageid - 6].ID + numeroPage;
          nextPages.Name = this.newGrid.PageList[pageid - 6].Name + numeroPage;
          nextPages.ElementIDsList = [];
          nextPages.NumberOfRows = this.newGrid.PageList[pageid - 6].NumberOfRows;
          nextPages.NumberOfCols = this.newGrid.PageList[pageid - 6].NumberOfCols;

          // numberNewPage - 1 !== i car on ne veut pas de bouton descendre dans la dernière page
          if (numberNewPageBis - 1 !== i) {
            this.gridElement = new GridElement('goDown ' + this.newGrid.PageList[pageid - 6].ID + (numeroPage + 1),
              {GoTo: this.newGrid.PageList[pageid - 6].ID + (numeroPage + 1)},
              '',
              '',
              '',
              1,
              [
                {
                  DisplayedText: 'go Down',
                  VoiceText: '',
                  LexicInfos: [{default: true}],
                  ImageID: '',
                }
              ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
            this.gridElement.cols = 1;
            this.gridElement.rows = 1;
            this.gridElement.y = nextPages.NumberOfRows - 1;
            this.gridElement.x = nextPages.NumberOfCols - 1;
            this.newGrid.ElementList.push(this.gridElement);
            nextPages.ElementIDsList.push(this.gridElement.ID);
          }
          this.buttonsNewPages(nextPages, i, pageid);
          this.newGrid.PageList.push(nextPages);
          numeroPage = numeroPage + 1;
        }
      }
    }
    else{
      const buttonPositionBis = gridPosition.split(',');
      const buttonRowBis = Number(buttonPositionBis[1]);
      // numberNewPage permet de connaitre le nombre de page à créer -1 puisque l'on créer déjà la première page en dehors
      const numberNewPageBis = Math.ceil(buttonRowBis / this.newGrid.PageList[pageid - 4].NumberOfRows) - 1;
      if(numberNewPageBis > 0) {
        // création du bouton pour descendre dans la page d'origine quand il y a plusieurs pages
        this.gridElement = new GridElement('goDown' + this.newGrid.PageList[pageid - 4].ID + numeroPage,
          {GoTo: this.newGrid.PageList[pageid - 4].ID + numeroPage},
          '',
          '',
          '',
          1,
          [
            {
              DisplayedText: 'go Down',
              VoiceText: '',
              LexicInfos: [{default: true}],
              ImageID: '',
            }
          ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
        this.gridElement.cols = 1;
        this.gridElement.rows = 1;
        this.gridElement.y = this.page.NumberOfRows - 1;
        this.gridElement.x = this.page.NumberOfCols - 1;
        this.newGrid.ElementList.push(this.gridElement);
        this.newGrid.PageList[pageid - 4].ElementIDsList.push(this.gridElement.ID);

        // conditions pour les pages de page
        for (let i = 0; i < numberNewPageBis; i++) {
          nextPages = new Page();
          nextPages.ID = this.newGrid.PageList[pageid - 4].ID + numeroPage;
          nextPages.Name = this.newGrid.PageList[pageid - 4].Name + numeroPage;
          nextPages.ElementIDsList = [];
          nextPages.NumberOfRows = this.newGrid.PageList[pageid - 4].NumberOfRows;
          nextPages.NumberOfCols = this.newGrid.PageList[pageid - 4].NumberOfCols;

          // numberNewPage - 1 !== i car on ne veut pas de bouton descendre dans la dernière page
          if (numberNewPageBis - 1 !== i) {
            this.gridElement = new GridElement('goDown ' + this.newGrid.PageList[pageid - 4].ID + (numeroPage + 1),
              {GoTo: this.newGrid.PageList[pageid - 4].ID + (numeroPage + 1)},
              '',
              '',
              '',
              1,
              [
                {
                  DisplayedText: 'go Down',
                  VoiceText: '',
                  LexicInfos: [{default: true}],
                  ImageID: '',
                }
              ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
            this.gridElement.cols = 1;
            this.gridElement.rows = 1;
            this.gridElement.y = nextPages.NumberOfRows - 1;
            this.gridElement.x = nextPages.NumberOfCols - 1;
            this.newGrid.ElementList.push(this.gridElement);
            nextPages.ElementIDsList.push(this.gridElement.ID);
          }
          this.buttonsNewPages(nextPages, i, pageid);
          this.newGrid.PageList.push(nextPages);
          numeroPage = numeroPage + 1;
        }
      }
    }
  }
  buttonsNewPages(nextPages: Page, indicePage: number, pageid: number){
    const buttonAllInfomations = this.db.prepare('SELECT * FROM ((\'ElementReference\' INNER JOIN \'ElementPlacement\' ON ElementReference.Id = ElementPlacement.ElementReferenceId) INNER JOIN \'Button\' ON ElementReference.Id = Button.ElementReferenceId) ORDER BY ID');
    while (buttonAllInfomations.step()) {
      const label = buttonAllInfomations.getAsObject().Label;
      const pos = buttonAllInfomations.getAsObject().GridPosition;
      const tabResPos = pos.split(',');
      const span = buttonAllInfomations.getAsObject().GridSpan;
      const tabResSpan = span.split(',');
      const buttonPageId = Number(buttonAllInfomations.getAsObject().PageId);
      this.gridElement = new GridElement(label, 'button', '', '', ''
        , 1,
        [
          {
            DisplayedText: label,
            VoiceText: label,
            LexicInfos: [{default: true}],
            ImageID: label,
          }
        ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
      this.gridElement.x = Number(tabResPos[0]);
      this.gridElement.y = Number(tabResPos[1]);
      this.gridElement.rows = Number(tabResSpan[1]);
      this.gridElement.cols = Number(tabResSpan[0]);
      // l'indice commence à 0 donc +1
      if(this.gridElement.y >= nextPages.NumberOfRows * (indicePage + 1) && this.gridElement.y < nextPages.NumberOfRows * (indicePage + 2) && pageid === buttonPageId){
        this.newGrid.ElementList.forEach(element => {if(element.ID === this.gridElement.ID){
          element.y = element.y % nextPages.NumberOfRows;
        }
        });
        nextPages.ElementIDsList.push(this.gridElement.ID);
      }
    }
  }
  InitnextPage(page: Page ,nextPages: Page){
    nextPages = new Page();
    nextPages.ElementIDsList = [];
    nextPages.NumberOfCols = page.NumberOfCols;
    nextPages.NumberOfRows = page.NumberOfRows;
  }
  createButtonDown(nextPages: Page){
    this.gridElement = new GridElement('goDown', {GoTo : nextPages.Name}, '', '', ''
      , 1,
      [
        {
          DisplayedText: 'go Down',
          VoiceText: '',
          LexicInfos: [{default: true}],
          ImageID: '',
        }
      ], [{ID: 'click', ActionList: [{ID: 'display', Options: []},{ID: 'say', Options: []}]}])
    this.gridElement.cols = 1;
    this.gridElement.rows = 1;
    this.gridElement.x = this.newGrid.NumberOfRows - 1;
    this.gridElement.y = this.newGrid.NumberOfCols - 1;
  }
  addColIfNeeded(){
    let resultat = false;
    this.newGrid.ElementList.forEach(element => {
      if(element.y + element.rows === this.page.NumberOfRows && element.x + element.cols === this.page.NumberOfCols && this.page.ElementIDsList.indexOf(element.ID) > -1){
        if(resultat === false) {
          this.page.NumberOfCols = this.page.NumberOfCols + 1;
          resultat = true;
        }
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
