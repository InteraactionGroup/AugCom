import {Component, OnInit} from '@angular/core';
import {MultilinguismService} from '../../services/multilinguism.service';
import {Grid, GridElement, Page} from '../../types';
import {BoardService} from '../../services/board.service';
import {Router} from '@angular/router';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {ConfigurationService} from '../../services/configuration.service';
import {SafeUrl} from '@angular/platform-browser';
import arasaacColoredJson from '../../../assets/arasaac-color-symbol-info.json';
import {ArasaacObject} from '../../libTypes';
import {LayoutService} from '../../services/layout.service';

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
    public configuration: ConfigurationService,
    public layoutService: LayoutService) {
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

  numberErrorImage: number;

  ngOnInit(): void {
    this.newGrid = new Grid('newGrid','Grid',0,0,[],[],[]);
    this.page = new Page();
    this.page.ID = '#HOME';
    this.page.Name = 'Accueil';
    this.page.ElementIDsList = [];
    this.pageHome = 4;
    this.numberErrorImage = 0;
    this.NumberOfCols = 0;
    this.NumberOfRows = 0;
  }

  /**
   * convert a spb file into a grid
   * @param file file imported
   */
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

  /**
   * load the database the the data from the file
   * @param arrayBuffer data from the file
   */
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
      while (tables.step()) {
        const rowObj = tables.getAsObject();
        const name = rowObj.name;

        if (name === 'Button'){
          this.getGridDimension();
          this.getElement(name);
        }
        if (name === 'PageSetProperties') {
          this.getPolice(name);
        }
      }
      this.DeleteDoublon(this.newGrid);
      console.log(this.newGrid);
      this.statErrorImage();
      this.boardService.board = this.newGrid;
      this.boardService.backHome();
      this.indexedDBacess.update();
      this.router.navigate(['']);
    });
  }
  getElement(name){
    const cel = this.db.prepare('SELECT * FROM \'' + name + '\'');
    const elReference = this.db.prepare('SELECT * FROM ElementReference');
    const elPlacement = this.db.prepare('SELECT * FROM \'ElementReference\' INNER JOIN \'ElementPlacement\' ON ElementReference.Id = ElementPlacement.ElementReferenceId ORDER BY ID');
    const buttonsFolder = this.db.prepare('SELECT * FROM ButtonPageLink');
    const buttonPage = this.db.prepare('SELECT ButtonId, Button.Label, Button.ElementReferenceId as ButtonElementRenceID,Page.Title, PageUniqueId, Page.Id, ElementPlacement.ElementReferenceId as ElementReferenceIdOfChild, ElementPlacement.GridPosition as ChildPosition, ElementPlacement.GridSpan as ChildSpan FROM \'Button\' JOIN \'ButtonPageLink\' ON Button.Id = ButtonPageLink.ButtonId JOIN \'PAGE\' ON ButtonPageLink.PageUniqueId = Page.UniqueID JOIN PageLayout ON PageId = Page.Id JOIN ElementPlacement ON PageLayoutId = PageLayout.ID ORDER BY ButtonId ASC');
    const pageTable = this.db.prepare('SELECT Title FROM Page');
    // skip the first button because we don't care about it
    elReference.step();
    buttonsFolder.step();
    elPlacement.step();
    // saute les 3 premières ligne car ne s'occupe pas de nos page et celle de l'accueil n'est pas intéressant
    pageTable.step();
    pageTable.step();
    pageTable.step();
    let elementReferenceOld = 0;
    let elementReferenceCurrent = 0;
    this.getMainPageDimension();
    // cel.step itère sur les ligne une à une
    while (cel.step()){
      elPlacement.step();
      elReference.step();

      // partie du code pour tenter de recupérer l'image originelle du bouton
      const pageSetImageId = elPlacement.getAsObject().PageSetImageId;
      if(pageSetImageId !== 0){
        // this.getImage();
      }
      // check si elementReference est le même entre 2 itérations si c'est le cas on va au suivant
      elementReferenceOld = elementReferenceCurrent;
      elementReferenceCurrent = elPlacement.getAsObject().ElementReferenceId;
      if(elementReferenceCurrent === elementReferenceOld) {
        while (elementReferenceCurrent === elementReferenceOld) {
          elPlacement.step();
          elementReferenceCurrent = elPlacement.getAsObject().ElementReferenceId;
        }
        elementReferenceOld = elementReferenceCurrent;
      }

      const buttonFolder = Number(buttonsFolder.getAsObject().ButtonId);
      const buttonId = Number(cel.getAsObject().Id);
      const buttonUniqueId = String(cel.getAsObject().UniqueId);

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

      const gridPosition = elPlacement.getAsObject().GridPosition;
      const gridSpan = elPlacement.getAsObject().GridSpan;
      const tabResPos = gridPosition.split(',');
      const tabResSpan = gridSpan.split(',');
      const label: string = cel.getAsObject().Label;
      const message: string = cel.getAsObject().Message;

      const pageId = elReference.getAsObject().PageId;

      // check if the button is a folder button to bind him
      if(buttonId === buttonFolder && label !== null){
        this.gridElement = new GridElement(buttonUniqueId,
          {GoTo : label},
          '',
          'rgb('+r+','+g+','+b+')',
          'rgb('+rb+','+gb+','+bb+')',
          1,
          [
            {
              DisplayedText: label,
              VoiceText: (message) !== null ? message : label,
              LexicInfos: [{default: true}],
              ImageID: (label) !== null ? label : message,
            }
          ], [{ID: 'click', ActionList: [{ID: 'display', Options: []},{ID: 'say', Options: []}]}])
        buttonsFolder.step();
        pageTable.step();
        const pageTitle = pageTable.getAsObject().Title;
        this.newPage = new Page();
        this.newPage.ID = label;
        this.newPage.Name = String(pageTitle);
        this.newPage.ElementIDsList = [];
        this.newGrid.PageList.unshift(this.newPage);
      }
      else if (buttonId === buttonFolder && label === null){
        this.gridElement = new GridElement(buttonUniqueId,
          {GoTo : String(buttonFolder)},
          '', 'rgb('+r+','+g+','+b+')',
          'rgb('+rb+','+gb+','+bb+')',
          1,
          [
            {
              DisplayedText: (message) !== null ? message : label,
              VoiceText: (message) !== null ? message : label,
              LexicInfos: [{default: true}],
              ImageID: (label) !== null ? label : message,
            }
          ], [{ID: 'click', ActionList: [{ID: 'display', Options: []},{ID: 'say', Options: []}]}])
        buttonsFolder.step();
        pageTable.step();
        const pageTitle = pageTable.getAsObject().Title;
        this.newPage = new Page();
        this.newPage.ID = String(buttonFolder);
        this.newPage.Name = String(pageTitle);
        this.newPage.ElementIDsList = [];
        this.newGrid.PageList.unshift(this.newPage);
      }
      else {
        this.gridElement = new GridElement(buttonUniqueId,
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
              ImageID: (label) !== null ? label : message,
            }
          ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
      }
      this.gridElement.x = Number(tabResPos[0]);
      this.gridElement.y = Number(tabResPos[1]);
      this.gridElement.rows = Number(tabResSpan[1]);
      this.gridElement.cols = Number(tabResSpan[0]);
      this.newGrid.ElementList.push(this.gridElement);
      this.getPageHome(pageId,this.gridElement);
      const pathImage = this.getPathImageArsaacLibrary(label,message);
      this.newGrid.ImageList.push({
        ID: (label) !== null ? label : message,
        OriginalName: (label) !== null ? label : message,
        Path: pathImage,
      });
    }
    this.addColIfNeeded();
    this.newGrid.PageList.unshift(this.page);
    this.getPageFolderButtons(buttonPage);
    this.goDownPage();
  }

  /**
   *
   * @param label the label of the button
   * @param message the message of the button
   */
  getPathImageArsaacLibrary(label,message):string{
    if (label !== null) {
      const index = (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.findIndex(word => {
        return label.toLowerCase() === word;
      });
      if(index > -1) {
        return 'assets/libs/FR_Pictogrammes_couleur/' + label.toLowerCase() + '.png';
      }
      else{
        return 'assets/libs/FR_Pictogrammes_couleur/' + label.toUpperCase() + '.png';
      }
    }
    else if (message !== null){
      const index = (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.findIndex(word => {
        return message.toLowerCase() === word;
      });
      if(index > -1) {
        return 'assets/libs/FR_Pictogrammes_couleur/' + message.toLowerCase() + '.png';
      }
      else{
        return 'assets/libs/FR_Pictogrammes_couleur/' + message.toUpperCase() + '.png';
      }
    }
    else{
      return 'assets/libs/FR_Pictogrammes_couleur/direction_1.png';
    }
  }

  /**
   * loads the buttons in the right folder on the right page
   * @param buttonPage request for buttonFolder in every page
   */
  getPageFolderButtons(buttonPage: any){
    while(buttonPage.step()) {
      const elementReferenceOfChild = Number(buttonPage.getAsObject().ElementReferenceIdOfChild);
      const labelFolder = String(buttonPage.getAsObject().Label);
      const labelFolderId = String(buttonPage.getAsObject().ButtonId);
      let index = this.newGrid.PageList.findIndex(page => page.ID === labelFolder);
      if(index === -1){
        index = this.newGrid.PageList.findIndex(page => page.ID === labelFolderId);
      }
      const pageId = Number(buttonPage.getAsObject().Id);
      const pageLayout = this.db.prepare('SELECT * FROM PageLayout WHERE PageId = ' + pageId);
      // on va prendre la taille la plus grande parmis toutes les dispositions pour etre sur d'accueillir tous les boutons
      const numberof = this.getPageDimensionMax(pageLayout);
      this.newGrid.PageList[index].NumberOfRows = Number(numberof[0]);
      this.newGrid.PageList[index].NumberOfCols = Number(numberof[1]);
      const childPositions = buttonPage.getAsObject().ChildPosition;
      const childPositionsXY = childPositions.split(',');
      // on ajoute tout les boutons aux différentes pages des boutons (uniquement leur première page)
      if(Number(childPositionsXY[1]) < this.newGrid.PageList[index].NumberOfRows) {
        this.newGrid.PageList[index].ElementIDsList.push(this.newGrid.ElementList[elementReferenceOfChild - 2].ID);
      }
    }
  }

  /**
   * Search in the database and set the number of rows and colomns in the grid
   */
  getGridDimension() {
    const gridDim = this.db.prepare('SELECT * FROM PageSetProperties');
    while (gridDim.step()) {
      const result = gridDim.getAsObject().GridDimension;
      const gridDimension = result.split(',');
      this.newGrid.NumberOfCols = Number(gridDimension[0]);
      this.newGrid.NumberOfRows = Number(gridDimension[1]);
    }
  }

  /**
   * query the database and set the number of rows and columns in the main page
   */
  getMainPageDimension(){
    const pageLayout = this.db.prepare('SELECT * FROM PageLayout WHERE PageId = 4');
    const numberof = this.getPageDimensionMax(pageLayout);
    this.page.NumberOfRows = Number(numberof[0]);
    this.page.NumberOfCols = Number(numberof[1]);
  }

  /**
   * set the max of rows and columns for every pages
   * @param pageLayout query from the database for pageLayout
   */
  getPageDimensionMax(pageLayout: any){
    // on va prendre la taille la plus grande parmis toutes les dispositions pour etre sur d'accueillir tous les boutons
    let numberOfRowsMax = 0;
    let numberOfColsMax = 0;
    while(pageLayout.step()){
      const pageLayoutSetting = pageLayout.getAsObject().PageLayoutSetting;
      const tabLayoutSetting = pageLayoutSetting.split(',');
      if(numberOfRowsMax <= Number(tabLayoutSetting[1]) && numberOfColsMax <= Number(tabLayoutSetting[0])){
        numberOfRowsMax = Number(tabLayoutSetting[1]);
        numberOfColsMax = Number(tabLayoutSetting[0]);
      }
    }
    return [numberOfRowsMax, numberOfColsMax];
  }

  /**
   * query the database to set the police
   * @param name the name of the table (useless if you put the great query)
   */
  getPolice(name){
    const po = this.db.prepare('SELECT * FROM \'' + name + '\'');
    po.step();
    const police = po.getAsObject().FontFamily;
    this.configuration.DEFAULT_STYLE_FONTFAMILY_VALUE = String(police);
  }

  /**
   * load buttons in the main page
   * @param pageId the Id of the current page
   * @param gridElement the current element
   */
  getPageHome(pageId: any, gridElement: GridElement){
    // -1 à cause des tableaux de l'enfer qui commencent à 0
    if (pageId === this.pageHome && gridElement.y <= this.page.NumberOfRows - 1) {
      this.page.ElementIDsList.push(gridElement.ID);
    }
  }

  /**
   * Create a button to go down in the page and load it
   */
  goDownPage(){
    let nextPages: Page = new Page();
    nextPages.ElementIDsList = [];
    let numeroPage = 1;
    let lastElementPageId: number;
    let RowMaxPage = 0;

    const gridPositionAndPageId = this.db.prepare('SELECT * FROM \'ElementPlacement\' INNER JOIN \'ElementReference\' ON ElementReference.Id = ElementPlacement.ElementReferenceId ORDER BY Id');
    let pageid = 4;
    gridPositionAndPageId.step();
    let gridPosition = gridPositionAndPageId.getAsObject().GridPosition;
    while(gridPositionAndPageId.step()) {
      const pageId = gridPositionAndPageId.getAsObject().PageId;
      const buttonPosition = gridPosition.split(',');
      const buttonRow = Number(buttonPosition[1]);
      if(RowMaxPage < buttonRow){
        RowMaxPage = buttonRow;
      }
      if (pageid !== pageId) {
        // numberNewPage permet de connaitre le nombre de page à créer -1 puisque l'on créer déjà la première page en dehors
        const numberNewPage = Math.ceil(RowMaxPage / this.newGrid.PageList[pageid - 4].NumberOfRows) - 1;
        RowMaxPage = 0;
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
      if(RowMaxPage < buttonRowBis){
        RowMaxPage = buttonRowBis;
      }
      // numberNewPage permet de connaitre le nombre de page à créer -1 puisque l'on créer déjà la première page en dehors
      const numberNewPageBis = Math.ceil(RowMaxPage / this.newGrid.PageList[pageid - 6].NumberOfRows) - 1;
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
      if(RowMaxPage < buttonRowBis){
        RowMaxPage = buttonRowBis;
      }
      // numberNewPage permet de connaitre le nombre de page à créer -1 puisque l'on créer déjà la première page en dehors
      const numberNewPageBis = Math.ceil((RowMaxPage + 1) / this.newGrid.PageList[pageid - 4].NumberOfRows) - 1;
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
      const buttonUniqueId = String(buttonAllInfomations.getAsObject().UniqueId);
      const pos = buttonAllInfomations.getAsObject().GridPosition;
      const tabResPos = pos.split(',');
      const span = buttonAllInfomations.getAsObject().GridSpan;
      const tabResSpan = span.split(',');
      const buttonPageId = Number(buttonAllInfomations.getAsObject().PageId);
      this.gridElement = new GridElement(buttonUniqueId, 'button', '', '', ''
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

  /**
   * removes all duplicate buttons in the grid
   * @param grid the current grid
   */
  DeleteDoublon(grid: Grid){
    grid.PageList.forEach(page => {
      page.ElementIDsList = Array.from(new Set(page.ElementIDsList));
    });
  }

  /**
   * create down button
   * @param nextPages the page that will be targeted by the button
   */
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

  /**
   * add a colomn if we need to add a button page down and we don't have place to do it
   */
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

  /**
   * checks that each image exists in the image bank and makes the error rate
   */
  statErrorImage(){
    this.newGrid.ImageList.forEach(picture => {
      const index = (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.findIndex(word => {
        return picture.ID !== null && picture.ID !== '' && (picture.ID.toLowerCase() === word || picture.ID.toUpperCase() === word);
      });

      if(index ===-1){
        // console.log(picture.ID);
        this.numberErrorImage = this.numberErrorImage + 1;
      }
    });
    console.log('pourcentage d\'erreur : ', this.numberErrorImage / this.newGrid.ImageList.length * 100);
  }
}
