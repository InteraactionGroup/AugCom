import { Component, OnInit } from '@angular/core';
import { MultilinguismService } from '../../services/multilinguism.service';
import { Grid, GridElement, Page } from '../../types';
import { BoardService } from '../../services/board.service';
import { Router } from '@angular/router';
import { IndexeddbaccessService } from '../../services/indexeddbaccess.service';
import { ConfigurationService } from '../../services/configuration.service';
import { SafeUrl } from '@angular/platform-browser';
import arasaacColoredJson from '../../../assets/arasaac-color-symbol-info.json';
import { ArasaacObject } from '../../libTypes';
import { LayoutService } from '../../services/layout.service';
//https://github.com/sql-js/sql.js
declare const initSqlJs: any;


@Component({
  selector: 'app-spb2aug-upgrade',
  templateUrl: './spb2aug-upgrade.component.html',
  styleUrls: ['./spb2aug-upgrade.component.css']
})
export class Spb2augUpgradeComponent implements OnInit {

  newGrid: Grid;
  page: Page;
  //gridElement: GridElement;
  rowCounts: number[];
  NumberOfCols: number;
  NumberOfRows: number;
  db = null;
  pageHome: number;
  newPage: Page;
  myBlob: Blob;
  myFile: File;
  myFileNameExtension;
  im: SafeUrl;
  numberErrorImage: number;
  numberOfPrediction: number = 1;

  constructor(
    public multilinguism: MultilinguismService,
    public indexedDBacess: IndexeddbaccessService,
    public router: Router,
    public boardService: BoardService,
    public configuration: ConfigurationService,
    public layoutService: LayoutService) {
  }

  ngOnInit(): void {
    this.newGrid = new Grid('newGrid', 'Grid', 0, 0, [], [], []);
    this.newGrid.software = 'Snap Core first'
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
   * convert a spb or sps file into a grid
   * @param file file imported
   */
  convert(file) {
    this.router.navigate(['loading']);
    this.newGrid.ID = 'newGrid';
    this.newGrid.GapSize = 5;
    const date: Date = new Date();
    this.newGrid.modificationDate = date.getDate().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getFullYear().toString();
    this.newGrid.creationDate = date.getDate().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getFullYear().toString();
    const myFile = file[0];
    this.myFileNameExtension = myFile.name.split('.').pop();
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.loadDB(fileReader);
    };
    fileReader.readAsArrayBuffer(myFile);
  }

  /**
   * load the database the data from the file
   * @param arrayBuffer data from the file
   */
  loadDB(arrayBuffer) {
    // initSqlJs is in the library sql.js, use npm install @types/sql.js
    initSqlJs().then(SQL => {
      try {
        this.db = new SQL.Database(new Uint8Array(arrayBuffer.result));
      } catch (ex) {
        alert(ex);
        return;
      }
      this.getGridDimension();
      this.getGridFromDatabase();
      //this.getPolice();
      //this.DeleteDoublon(this.newGrid);
      console.log(this.newGrid);
      this.statErrorImage();
      //this.addColIfNeeded();
      let that = this;
      setTimeout(function () {
        that.db.close();
        that.boardService.board = that.newGrid;
        that.layoutService.refreshAll(that.newGrid.NumberOfCols, that.newGrid.NumberOfRows, that.newGrid.GapSize);
        that.boardService.backHome();
        that.indexedDBacess.update();
        that.router.navigate(['keyboard']);
      }, 500);
    });
  }

  /**
   * the main function where we get the grid from the database
   */
  getGridFromDatabase() {
    this.AdjustBDD();
    this.getAllPagesFromDatabase();
    this.setMainPage();
  }

  //Here i have to adjust BDD because a useless element is present in table ElementReference at pageId 3 on SPB file only
  AdjustBDD(){
    if(this.myFileNameExtension == "spb"){
      this.db.run('UPDATE ElementReference SET Id = Id -1');
      this.db.run('UPDATE ElementPlacement SET ElementReferenceId = ElementReferenceId -1');
    }
  }

  getAllPagesFromDatabase(){
    //need to swap UniqueId and Id because folderButton target ID and we need the value UniqueId in
    const queryPage = this.db.prepare('SELECT Id as uniqueId, UniqueId as id, Title FROM Page');
    while(queryPage.step()){
      let newPage = new Page();
      newPage.ID = String(queryPage.getAsObject().id);
      newPage.UniquePageId = String(queryPage.getAsObject().uniqueId);
      newPage.Name = queryPage.getAsObject().Title;
      newPage.ElementIDsList = [];
      const queryPageLayout = this.db.prepare('SELECT Id,PageLayoutSetting FROM PageLayout WHERE PageId =' + queryPage.getAsObject().uniqueId);
      const tabNumberOfColsRowsPagelayoutid = this.getPageDimensionMax(queryPageLayout);
      queryPageLayout.free();
      newPage.NumberOfRows = Number(tabNumberOfColsRowsPagelayoutid[0]);
      newPage.NumberOfCols = Number(tabNumberOfColsRowsPagelayoutid[1]);
      this.addButtonsToPage(tabNumberOfColsRowsPagelayoutid[2], newPage);
      this.newGrid.PageList.push(newPage);
    }
    queryPage.free();

  }

  addButtonsToPage(pageLayoutId:any, currentPage: Page){
    const buttonTable = this.db.prepare('SELECT ElementPlacement.GridPosition,ElementPlacement.GridSpan,ElementReference.BackgroundColor,Button.Id AS ButtonId,ButtonPageLink.ButtonId AS ButtonIdFromButtonPageLink,Button.UniqueId AS ButtonUniqueId,Button.BorderColor,ButtonPageLink.PageUniqueId,Button.Label,Button.Message FROM ElementReference INNER JOIN ElementPlacement ON ElementReference.Id = ElementPlacement.ElementReferenceId AND ElementPlacement.PageLayoutId = '+ pageLayoutId+' FULL OUTER JOIN Button ON ElementReference.Id = Button.Id FULL OUTER JOIN ButtonPageLink ON Button.Id = ButtonPageLink.ButtonId WHERE ElementReference.PageId = '+ currentPage.UniquePageId+' AND ElementType = 0 ORDER BY ElementReference.Id');
    //itère sur toute la table bouton
    let gridElement:GridElement;
    while(buttonTable.step()){
      //elPlacement.step();

      let gridPosition = buttonTable.getAsObject().GridPosition;
      const gridSpan = buttonTable.getAsObject().GridSpan;

      let buttonUniqueId: string = buttonTable.getAsObject().ButtonUniqueId;
      let label: string = buttonTable.getAsObject().Label;
      let linkFolder = buttonTable.getAsObject().PageLink;
      let message: string = buttonTable.getAsObject().Message;
      let borderColor = buttonTable.getAsObject().BorderColor;
      let color = buttonTable.getAsObject().BackgroundColor;

      const B_MASK = 255;
      const G_MASK = 255 << 8; // 65280
      const R_MASK = 255 << 16; // 16711680
      const r = (color & R_MASK) >> 16;
      const g = (color & G_MASK) >> 8;
      const b = color & B_MASK;

      const rb = (borderColor & R_MASK) >> 16;
      const gb = (borderColor & G_MASK) >> 8;
      const bb = borderColor & B_MASK

      const tabResPos = gridPosition.split(',');
      const tabResSpan = gridSpan.split(',');

      let buttonFolderInIdPage: string = buttonTable.getAsObject().PageUniqueId;
      //remplissage avec les boutons dossiers sinon les boutons normaux
      if(buttonFolderInIdPage !== null) {
        gridElement = new GridElement(buttonUniqueId,
          {GoTo: String(linkFolder)},
          '', 'rgb(' + r + ',' + g + ',' + b + ')',
          'rgb(' + rb + ',' + gb + ',' + bb + ')',
          0,
          [
            {
              DisplayedText: (message) !== null ? message : label,
              VoiceText: (message) !== null ? message : label,
              LexicInfos: [{default: true}],
              ImageID: label,
            }
          ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
      }else{
        gridElement = new GridElement(buttonUniqueId,
          'button',
          '', 'rgb(' + r + ',' + g + ',' + b + ')',
          'rgb(' + rb + ',' + gb + ',' + bb + ')',
          0,
          [
            {
              DisplayedText: (message) !== null ? message : label,
              VoiceText: (message) !== null ? message : label,
              LexicInfos: [{default: true}],
              ImageID: label,
            }
          ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
      }
      gridElement.x = Number(tabResPos[0]);
      gridElement.y = Number(tabResPos[1]);
      gridElement.rows = Number(tabResSpan[1]);
      gridElement.cols = Number(tabResSpan[0]);
      const pathImage = this.getPathImageArsaacLibrary(label, message);
      this.newGrid.ImageList.push({
        ID: label,
        OriginalName: label,
        Path: pathImage,
      });
      this.newGrid.ElementList.push(gridElement);
      console.log(gridElement);
      //Pousse l'élément dans la bonne page, si nécessaire créer une page
      this.goDownPage(gridElement, currentPage);
    }
    console.log("length : ",this.newGrid.ElementList.length);
    buttonTable.free();
  }

  goDownPage(gridElement:GridElement, currentPage:Page){
    console.log('gridElement.rows : '+ gridElement.rows+ ' currentPage.NumberOfRows : ' + currentPage.NumberOfRows);
    if(gridElement.y >= currentPage.NumberOfRows){
      //le bouton goDown
      let numeroPage = '1';
      let goDownElement = new GridElement('goDown' + currentPage.ID + numeroPage,
        { GoTo: 'goDown' + currentPage.ID + numeroPage },
        '',
        '',
        '',
        0,
        [
          {
            DisplayedText: 'go Down',
            VoiceText: '',
            LexicInfos: [{ default: true }],
            ImageID: '',
          }
        ], [{ ID: 'click', ActionList: [{ ID: 'display', Options: [] }, { ID: 'say', Options: [] }] }])
      goDownElement.cols = 1;
      goDownElement.rows = 1;
      goDownElement.y = currentPage.NumberOfRows - 1;
      goDownElement.x = currentPage.NumberOfCols - 1;
      this.newGrid.ElementList.push(goDownElement);
      currentPage.ElementIDsList.push(goDownElement.ID);
      //la page suivante
      //connaitre à quel page se trouve l'element dans mes goDown
      const comprehension:string = String(Math.ceil((gridElement.y + 1) / currentPage.NumberOfRows));
      let nextPage: Page = new Page();
      nextPage.ID = 'goDown' + String(currentPage.ID)+ String(numeroPage);
      nextPage.UniquePageId = currentPage.UniquePageId + numeroPage;
      nextPage.Name = currentPage.Name + numeroPage;
      nextPage.ElementIDsList = [];
      nextPage.NumberOfRows = currentPage.NumberOfRows;
      nextPage.NumberOfCols = currentPage.NumberOfCols;
      gridElement.y = gridElement.y % currentPage.NumberOfRows;
      nextPage.ElementIDsList.push(gridElement.ID);
      this.newGrid.PageList.push(nextPage);
    }else{
      currentPage.ElementIDsList.push(gridElement.ID);
    }
  }

  goDownPageRemastered(gridElement:GridElement) {
    const eachPageReal = this.db.prepare('SELECT Id FROM Page');
    eachPageReal.step();
    eachPageReal.step();
    while (eachPageReal.step()) {
      const pageId = eachPageReal.getAsObject().Id;
      const eachPage = this.db.prepare('SELECT PageLayoutSetting,Id FROM PageLayout WHERE PageId == ' + pageId);
      let pageLayoutId;
      const pageLayout = this.getPageDimensionMax(eachPage);
      eachPage.free();
      let nextPages: Page = new Page();
      nextPages.NumberOfRows = pageLayout[0];
      nextPages.NumberOfCols = pageLayout[1];
      pageLayoutId = pageLayout[2];
      nextPages.ElementIDsList = [];
      let numeroPage = 1;
      let RowMaxPage = 0;
      let pageid = 0;
      const buttonRowMaxPage = this.db.prepare('SELECT GridPosition,PageId FROM \'ElementPlacement\' INNER JOIN \'ElementReference\' ON ElementReference.Id = ElementPlacement.ElementReferenceId WHERE PageLayoutId ==  ' + pageLayoutId + ' ORDER BY ElementPlacement.Id');
      while (buttonRowMaxPage.step()) {
        const gridPosition = buttonRowMaxPage.getAsObject().GridPosition;
        const buttonPosition = gridPosition.split(',');
        const buttonRow = Number(buttonPosition[1]);
        if (RowMaxPage < buttonRow) {
          RowMaxPage = buttonRow;
          pageid = buttonRowMaxPage.getAsObject().PageId;
        }
      }
      buttonRowMaxPage.free();
      if (this.newGrid.PageList[pageid - 4] != null) {
        const numberNewPage = Math.floor(RowMaxPage / this.newGrid.PageList[pageid - 4].NumberOfRows);
        if (numberNewPage > 0) {
          gridElement = new GridElement('goDown' + this.newGrid.PageList[pageid - 4].ID + numeroPage,
            { GoTo: this.newGrid.PageList[pageid - 4].ID + numeroPage },
            '',
            '',
            '',
            0,
            [
              {
                DisplayedText: 'go Down',
                VoiceText: '',
                LexicInfos: [{ default: true }],
                ImageID: '',
              }
            ], [{ ID: 'click', ActionList: [{ ID: 'display', Options: [] }, { ID: 'say', Options: [] }] }])
          gridElement.cols = 1;
          gridElement.rows = 1;
          gridElement.y = this.page.NumberOfRows - 1;
          gridElement.x = this.page.NumberOfCols - 1;

          this.newGrid.ElementList.push(gridElement);
          this.newGrid.PageList[pageid - 4].ElementIDsList.push(gridElement.ID);
          // conditions pour les pages de page
          for (let i = 0; i < numberNewPage; i++) {
            nextPages = new Page();
            nextPages.ID = this.newGrid.PageList[pageid - 4].ID + numeroPage;
            nextPages.Name = this.newGrid.PageList[pageid - 4].Name + numeroPage;
            nextPages.ElementIDsList = [];
            nextPages.NumberOfRows = this.newGrid.PageList[pageid - 4].NumberOfRows;
            nextPages.NumberOfCols = this.newGrid.PageList[pageid - 4].NumberOfCols;

            // numberNewPage - 1 !== i because we don't want a down button in the last page
            if (numberNewPage - 1 !== i) {
              gridElement = new GridElement('goDown ' + this.newGrid.PageList[pageid - 4].ID + (numeroPage + 1),
                { GoTo: this.newGrid.PageList[pageid - 4].ID + (numeroPage + 1) },
                '',
                '',
                '',
                0,
                [
                  {
                    DisplayedText: 'go Down',
                    VoiceText: '',
                    LexicInfos: [{ default: true }],
                    ImageID: '',
                  }
                ], [{ ID: 'click', ActionList: [{ ID: 'display', Options: [] }, { ID: 'say', Options: [] }] }])
              gridElement.cols = 1;
              gridElement.rows = 1;
              gridElement.y = nextPages.NumberOfRows - 1;
              gridElement.x = nextPages.NumberOfCols - 1;
              this.newGrid.ElementList.push(gridElement);
              nextPages.ElementIDsList.push(gridElement.ID);
            }
            this.buttonsNewPages(nextPages, i, pageid, gridElement);
            this.newGrid.PageList.push(nextPages);
            numeroPage = numeroPage + 1;
          }
        }
      }
    }
    eachPageReal.free();
  }
  setMainPage(){
    if(this.myFileNameExtension == "sps"){
      const pageSetProperties = this.db.prepare('SELECT DefaultHomePageUniqueId FROM PageSetProperties');
      pageSetProperties.step();
      const defaultHomePageUniqueId = pageSetProperties.getAsObject().DefaultHomePageUniqueId;
      let homePage = this.newGrid.PageList.find(page => page.ID === defaultHomePageUniqueId);
      homePage.ID = '#HOME';
      pageSetProperties.free();
    }else{
      const queryHomePageForSpb = this.db.prepare('SELECT Id,UniqueId FROM Page WHERE Id = 4');
      queryHomePageForSpb.step();
      const defaultHomePageUniqueId = queryHomePageForSpb.getAsObject().UniqueId;
      let homePage = this.newGrid.PageList.find(page => page.ID === defaultHomePageUniqueId);
      homePage.ID = '#HOME';
      queryHomePageForSpb.free();
    }
  }

  //TODO extract extra page from the table PageExtra who should indicate the page with a second page or more (ou peut être pas)
  getExtraPage(){}

  /**
   *
   * @param label the label of the button
   * @param message the message of the button
   */
  getPathImageArsaacLibrary(label, message): string {
    if (label !== null) {
      const index = (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.findIndex(word => {
        return label.toLowerCase() === word.toLowerCase();
      });
      if (index > -1) {
        return 'assets/libs/FR_Pictogrammes_couleur/' + (arasaacColoredJson as unknown as ArasaacObject)[0].wordList[index] + '.png';
      }
    }

    if (message !== null) {
      const index = (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.findIndex(word => {
        return message.toLowerCase() === word.toLowerCase();
      });
      if (index > -1) {
        return 'assets/libs/FR_Pictogrammes_couleur/' + (arasaacColoredJson as unknown as ArasaacObject)[0].wordList[index] + '.png';
      }
    }


    return '';
  }

  /**
   * loads the buttons in the right folder on the right page
   * @param buttonPage request for buttonFolder in every page
   */
  getPageFolderButtons(buttonPage: any) {
    while (buttonPage.step()) {
      const elementReferenceOfChild = Number(buttonPage.getAsObject().ElementReferenceIdOfChild);
      let labelFolder = String(buttonPage.getAsObject().Label);
      const labelFolderId = String(buttonPage.getAsObject().ButtonId);

      let index = this.newGrid.PageList.findIndex(page => page.ID === labelFolder);
      if (index === -1) {
        index = this.newGrid.PageList.findIndex(page => page.ID === labelFolderId);
      }
      // si vraiment on ne trouve pas, on l'ignore
      if (index !== -1) {
        // si le bouton dossier a bien une page qui lui correspond
        const pageId = Number(buttonPage.getAsObject().Id);
        const pageLayout = this.db.prepare('SELECT PageLayoutSetting,Id FROM PageLayout WHERE PageId = ' + pageId);
        const numberof = this.getPageDimensionMax(pageLayout);
        pageLayout.free();
        this.newGrid.PageList[index].NumberOfRows = Number(numberof[0]);
        this.newGrid.PageList[index].NumberOfCols = Number(numberof[1]);
        const pageLayoutSelected = Number(numberof[2]);
        const childPositions = buttonPage.getAsObject().ChildPosition;
        const childPositionsXY = childPositions.split(',');

        // on ajoute tous les boutons aux différentes pages des boutons (uniquement leur première page)
        if (Number(childPositionsXY[1]) < this.newGrid.PageList[index].NumberOfRows) {

          //normal case
          if (this.newGrid.ElementList.length > (elementReferenceOfChild - 2)) {
            this.newGrid.PageList[index].ElementIDsList.push(this.newGrid.ElementList[elementReferenceOfChild - 2].ID);
          } else {
            //case they don't start their ID at 0 as usual
            let indexOfElementReferenceOfChild = this.newGrid.ElementList.findIndex(Elem =>
              Elem.ID === labelFolder
            );
            this.newGrid.PageList[index].ElementIDsList.push(this.newGrid.ElementList[indexOfElementReferenceOfChild].ID);
          }
        }
      }
    }
  }

  /**
   * Search in the database and set the number of rows and colomns in the grid
   */
  getGridDimension() {
    const gridDim = this.db.prepare('SELECT GridDimension FROM PageSetProperties');
    while (gridDim.step()) {
      const result = gridDim.getAsObject().GridDimension;
      const gridDimension = result.split(',');
      this.newGrid.NumberOfCols = Number(gridDimension[0]);
      this.newGrid.NumberOfRows = Number(gridDimension[1]);
    }
    gridDim.free();
  }

  /**
   * get the max of rows and columns for every pages and return the pageLayoutId
   * @param page query from the database for page in PageLayout table
   */
  getPageDimensionMax(page: any): number[] {
    let numberOfRowsMax = 0;
    let numberOfColsMax = 0;
    let pageLayoutId = 0;
    while (page.step()) {
      const pageLayoutSetting = page.getAsObject().PageLayoutSetting;
      const pageLayoutIdDataBase = page.getAsObject().Id;
      const tabLayoutSetting = pageLayoutSetting.split(',');
      if (numberOfRowsMax <= Number(tabLayoutSetting[1]) && numberOfColsMax <= Number(tabLayoutSetting[0])) {
        numberOfRowsMax = Number(tabLayoutSetting[1]);
        numberOfColsMax = Number(tabLayoutSetting[0]);
        pageLayoutId = pageLayoutIdDataBase;
      }
    }
    return [numberOfRowsMax, numberOfColsMax, pageLayoutId];
  }

  /**
   * Create a button to go down in the page and load it
   */



  /**
   * fill in the rest of the page with the corresponding buttons
   * @param nextPages the page to fill
   * @param indicePage index of the page to be filled
   * @param pageid index of the page in the database
   */
  buttonsNewPages(nextPages: Page, indicePage: number, pageid: number, gridElement:GridElement) {
    const buttonAllInfomations = this.db.prepare("SELECT Label,UniqueId,GridPosition,GridSpan,PageId FROM (('ElementReference' INNER JOIN 'ElementPlacement' ON ElementReference.Id = ElementPlacement.ElementReferenceId) INNER JOIN 'Button' ON ElementReference.Id = Button.ElementReferenceId) ORDER BY ElementReference.Id");
    while (buttonAllInfomations.step()) {
      let label = buttonAllInfomations.getAsObject().Label;

      if(label === null){
        label = "Prediction" + this.numberOfPrediction.toString();
        this.numberOfPrediction = this.numberOfPrediction + 1;
      }

      const buttonUniqueId = String(buttonAllInfomations.getAsObject().UniqueId);
      const pos = buttonAllInfomations.getAsObject().GridPosition;
      const tabResPos = pos.split(',');
      const span = buttonAllInfomations.getAsObject().GridSpan;
      const tabResSpan = span.split(',');
      const buttonPageId = Number(buttonAllInfomations.getAsObject().PageId);
      gridElement = new GridElement(label, 'button', '', '', ''
        , 0,
        [
          {
            DisplayedText: label,
            VoiceText: label,
            LexicInfos: [{ default: true }],
            ImageID: label,
          }
        ], [{ ID: 'click', ActionList: [{ ID: 'display', Options: [] }, { ID: 'say', Options: [] }] }])
      gridElement.x = Number(tabResPos[0]);
      gridElement.y = Number(tabResPos[1]);
      gridElement.rows = Number(tabResSpan[1]);
      gridElement.cols = Number(tabResSpan[0]);
      // l'indice commence à 0 donc +1
      if (gridElement.y >= nextPages.NumberOfRows * (indicePage + 1) && gridElement.y < nextPages.NumberOfRows * (indicePage + 2) && pageid === buttonPageId) {
        this.newGrid.ElementList.forEach(element => {
          if (element.ID === gridElement.ID) {
            element.y = element.y % nextPages.NumberOfRows;
          }
        });
        nextPages.ElementIDsList.push(gridElement.ID);
      }
    }
    buttonAllInfomations.free();
  }

  /**
   * removes all duplicate buttons in the grid
   * @param grid the current grid
   */
  DeleteDoublon(grid: Grid) {
    grid.PageList.forEach(page => {
      page.ElementIDsList = Array.from(new Set(page.ElementIDsList));
    });
  }

  /**
   * add a column if we need to add a button page down, and we don't have place to do it
   */
  addColIfNeeded() {
    try {
      let isColAdd = false;
      this.newGrid.PageList.forEach(page => {
        let indexGoDownButtonPage = this.newGrid.ElementList.findIndex(element => element.ID.includes('goDown'));
        if (indexGoDownButtonPage > -1) {
          this.newGrid.ElementList.forEach(element => {
            if (element.y + element.rows === this.page.NumberOfRows && element.x + element.cols === this.page.NumberOfCols && this.page.ElementIDsList.indexOf(element.ID) > -1 && element.ID.includes('goDown') === false) {
              if (isColAdd === false) {
                this.page.NumberOfCols = this.page.NumberOfCols + 1;
                this.newGrid.ElementList[indexGoDownButtonPage].y = this.page.NumberOfRows - 1;
                this.newGrid.ElementList[indexGoDownButtonPage].x = this.page.NumberOfCols - 1;
                isColAdd = true;
              }
            }
          });
        }
      });
    } finally {
      console.log("No col needed");
    }
  }

  /**
   * checks that each image exists in the image bank and makes the error rate
   */
  statErrorImage() {
    this.newGrid.ImageList.forEach(picture => {
      const index = (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.findIndex(word => {
        return picture.ID !== null && picture.ID !== '' && (picture.ID.toLowerCase() === word || picture.ID.toUpperCase() === word);
      });

      if (index === -1) {
        // console.log(picture.ID);
        this.numberErrorImage = this.numberErrorImage + 1;
      }
    });
    console.log('pourcentage d\'erreur : ', this.numberErrorImage / this.newGrid.ImageList.length * 100 + '%');
  }

}
