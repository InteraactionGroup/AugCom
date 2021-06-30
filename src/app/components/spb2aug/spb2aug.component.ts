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

  newGrid: Grid;
  page: Page;
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
  convert(file) {
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
      try {
        this.db = new SQL.Database(new Uint8Array(arrayBuffer.result));
      } catch (ex) {
        alert(ex);
        return;
      }
      this.getGridDimension();
      this.getGridFromDatabase();
      this.getPolice();
      this.DeleteDoublon(this.newGrid);
      console.log(this.newGrid);
      this.statErrorImage();
      this.addColIfNeeded();
      this.boardService.board = this.newGrid;
      this.boardService.backHome();
      this.indexedDBacess.update();
      this.router.navigate(['']);
    });
  }

  /**
   * the main function where we get the grid from the database
   */
  getGridFromDatabase() {
    let pageLayoutSelected = this.getMainPageDimension();
    const buttonTable = this.db.prepare('SELECT * FROM button');
    const elReference = this.db.prepare('SELECT * FROM ElementReference');
    let elPlacement = this.db.prepare('SELECT * FROM \'ElementReference\' INNER JOIN \'ElementPlacement\' ON ElementReference.Id = ElementPlacement.ElementReferenceId WHERE PageLayoutId == ' + pageLayoutSelected + ' ORDER BY ID');
    const buttonsFolder = this.db.prepare('SELECT * FROM ButtonPageLink');
    const buttonPage = this.db.prepare('SELECT ButtonId, Button.Label, Button.ElementReferenceId as ButtonElementRenceID,Page.Title, PageUniqueId, Page.Id, ElementPlacement.ElementReferenceId as ElementReferenceIdOfChild, ElementPlacement.GridPosition as ChildPosition, ElementPlacement.GridSpan as ChildSpan FROM \'Button\' JOIN \'ButtonPageLink\' ON Button.Id = ButtonPageLink.ButtonId JOIN \'PAGE\' ON ButtonPageLink.PageUniqueId = Page.UniqueID JOIN PageLayout ON PageId = Page.Id JOIN ElementPlacement ON PageLayoutId = PageLayout.ID  ORDER BY ButtonId ASC');
    elReference.step();
    buttonsFolder.step();
    // variable that is used to know the page that is being filled in
    let pageIdSelected = 4;
    // read line by line the table "button"
    while (buttonTable.step()) {
      elPlacement.step();
      elReference.step();

      let gridPosition = elPlacement.getAsObject().GridPosition;

      while (gridPosition == null) {
        pageIdSelected = pageIdSelected + 1;
        const pageLayout = this.db.prepare('SELECT * FROM PageLayout WHERE PageId =' + pageIdSelected);
        pageLayoutSelected = this.getPageDimensionMax(pageLayout)[2];
        elPlacement = this.db.prepare('SELECT * FROM \'ElementReference\' INNER JOIN \'ElementPlacement\' ON ElementReference.Id = ElementPlacement.ElementReferenceId WHERE PageLayoutId == ' + pageLayoutSelected + ' ORDER BY ID');
        elPlacement.step();
        gridPosition = elPlacement.getAsObject().GridPosition;
      }
      const gridSpan = elPlacement.getAsObject().GridSpan;

      const buttonFolder = Number(buttonsFolder.getAsObject().ButtonId);
      const buttonId = Number(buttonTable.getAsObject().Id);
      const buttonUniqueId = String(buttonTable.getAsObject().UniqueId);

      const color = Number(elPlacement.getAsObject().BackgroundColor);
      const borderColor = Number(buttonTable.getAsObject().BorderColor);

      const B_MASK = 255;
      const G_MASK = 255 << 8; // 65280
      const R_MASK = 255 << 16; // 16711680
      const r = (color & R_MASK) >> 16;
      const g = (color & G_MASK) >> 8;
      const b = color & B_MASK;

      const rb = (borderColor & R_MASK) >> 16;
      const gb = (borderColor & G_MASK) >> 8;
      const bb = borderColor & B_MASK;


      const tabResPos = gridPosition.split(',');
      const tabResSpan = gridSpan.split(',');
      const label: string = buttonTable.getAsObject().Label;
      const message: string = buttonTable.getAsObject().Message;

      const pageId = elReference.getAsObject().PageId;

      // check if the button is a folder button to bind him
      if (buttonId === buttonFolder && label !== null) {
        this.gridElement = new GridElement(buttonUniqueId,
          {GoTo: label},
          '',
          'rgb(' + r + ',' + g + ',' + b + ')',
          'rgb(' + rb + ',' + gb + ',' + bb + ')',
          1,
          [
            {
              DisplayedText: label,
              VoiceText: (message) !== null ? message : label,
              LexicInfos: [{default: true}],
              ImageID: (label) !== null ? label : message,
            }
          ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
        const pageUniqueIdFromButtonFolder = buttonsFolder.getAsObject().PageUniqueId;
        const querySearchTitle = this.db.prepare('SELECT Title FROM Page WHERE UniqueId == "' + String(pageUniqueIdFromButtonFolder) + '"');
        querySearchTitle.step();
        buttonsFolder.step();
        this.newPage = new Page();
        this.newPage.ID = label;
        this.newPage.Name = String(querySearchTitle.getAsObject().Title);
        this.newPage.ElementIDsList = [];
        this.newGrid.PageList.unshift(this.newPage);
      } else if (buttonId === buttonFolder && label === null) {
        this.gridElement = new GridElement(buttonUniqueId,
          {GoTo: String(buttonFolder)},
          '', 'rgb(' + r + ',' + g + ',' + b + ')',
          'rgb(' + rb + ',' + gb + ',' + bb + ')',
          1,
          [
            {
              DisplayedText: (message) !== null ? message : label,
              VoiceText: (message) !== null ? message : label,
              LexicInfos: [{default: true}],
              ImageID: (label) !== null ? label : message,
            }
          ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
        const pageUniqueIdFromButtonFolder = buttonsFolder.getAsObject().PageUniqueId;
        const querySearchTitle = this.db.prepare('SELECT Title FROM Page WHERE UniqueId == "' + String(pageUniqueIdFromButtonFolder) + '"');
        querySearchTitle.step();
        buttonsFolder.step();
        this.newPage = new Page();
        this.newPage.ID = String(buttonFolder);
        this.newPage.Name = String(querySearchTitle.getAsObject().Title);
        this.newPage.ElementIDsList = [];
        this.newGrid.PageList.unshift(this.newPage);
      } else {
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
      this.getPageHomeButtons(pageId, this.gridElement);
      this.getPageHomeTitle(pageId)
      const pathImage = this.getPathImageArsaacLibrary(label, message);
      this.newGrid.ImageList.push({
        ID: (label) !== null ? label : message,
        OriginalName: (label) !== null ? label : message,
        Path: pathImage,
      });
    }
    this.newGrid.PageList.unshift(this.page);
    this.getPageFolderButtons(buttonPage);
    this.goDownPageRemastered();
  }

  /**
   *
   * @param label the label of the button
   * @param message the message of the button
   */
  getPathImageArsaacLibrary(label, message): string {
    if (label !== null) {
      const index = (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.findIndex(word => {
        return label.toLowerCase() === word;
      });
      if (index > -1) {
        return 'assets/libs/FR_Pictogrammes_couleur/' + label.toLowerCase() + '.png';
      } else {
        return 'assets/libs/FR_Pictogrammes_couleur/' + label.toUpperCase() + '.png';
      }
    } else if (message !== null) {
      const index = (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.findIndex(word => {
        return message.toLowerCase() === word;
      });
      if (index > -1) {
        return 'assets/libs/FR_Pictogrammes_couleur/' + message.toLowerCase() + '.png';
      } else {
        return 'assets/libs/FR_Pictogrammes_couleur/' + message.toUpperCase() + '.png';
      }
    } else {
      return 'assets/libs/FR_Pictogrammes_couleur/direction_1.png';
    }
  }

  /**
   * loads the buttons in the right folder on the right page
   * @param buttonPage request for buttonFolder in every page
   */
  getPageFolderButtons(buttonPage: any) {
    while (buttonPage.step()) {
      const elementReferenceOfChild = Number(buttonPage.getAsObject().ElementReferenceIdOfChild);
      const labelFolder = String(buttonPage.getAsObject().Label);
      const labelFolderId = String(buttonPage.getAsObject().ButtonId);
      let index = this.newGrid.PageList.findIndex(page => page.ID === labelFolder);
      if (index === -1) {
        index = this.newGrid.PageList.findIndex(page => page.ID === labelFolderId);
      }
      const pageId = Number(buttonPage.getAsObject().Id);
      const pageLayout = this.db.prepare('SELECT * FROM PageLayout WHERE PageId = ' + pageId);
      const numberof = this.getPageDimensionMax(pageLayout);
      this.newGrid.PageList[index].NumberOfRows = Number(numberof[0]);
      this.newGrid.PageList[index].NumberOfCols = Number(numberof[1]);
      const pageLayoutSelected = Number(numberof[2]);
      const childPositions = buttonPage.getAsObject().ChildPosition;
      const childPositionsXY = childPositions.split(',');
      // on ajoute tout les boutons aux différentes pages des boutons (uniquement leur première page)
      if (Number(childPositionsXY[1]) < this.newGrid.PageList[index].NumberOfRows) {
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
  getMainPageDimension(): number {
    const page = this.db.prepare('SELECT * FROM PageLayout WHERE PageId == 4');
    const numberof = this.getPageDimensionMax(page);
    this.page.NumberOfRows = Number(numberof[0]);
    this.page.NumberOfCols = Number(numberof[1]);
    return Number(numberof[2]);
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
   * query the database to set the police
   */
  getPolice() {
    const po = this.db.prepare('SELECT * FROM PageSetProperties');
    po.step();
    const police = po.getAsObject().FontFamily;
    this.configuration.DEFAULT_STYLE_FONTFAMILY_VALUE = String(police);
  }

  /**
   * load buttons in the main page
   * @param pageId the Id of the current page
   * @param gridElement the current element
   */
  getPageHomeButtons(pageId: any, gridElement: GridElement) {
    console.log('gridElement.y', gridElement.y)
    console.log('this.page.NumberOfRows - 1 : ', this.page.NumberOfRows - 1)
    if (pageId === this.pageHome && gridElement.y <= this.page.NumberOfRows - 1) {
      this.page.ElementIDsList.push(gridElement.ID);
    }
  }

  /**
   * check the current page if it's the main page it will set the good title
   * @param pageId current page
   */
  getPageHomeTitle(pageId: any) {
    let titlePage;
    if (pageId === this.pageHome) {
      titlePage = this.db.prepare('SELECT Title FROM Page WHERE id ==' + 4);
      titlePage.step();
      this.page.Name = String(titlePage.getAsObject().Title);
    }
  }

  /**
   * Create a button to go down in the page and load it
   */
  goDownPageRemastered() {
    const eachPageReal = this.db.prepare('SELECT * FROM Page');
    eachPageReal.step();
    eachPageReal.step();
    while (eachPageReal.step()) {
      const pageId = eachPageReal.getAsObject().Id;
      const eachPage = this.db.prepare('SELECT * FROM PageLayout WHERE PageId == ' + pageId);
      let pageLayoutId;
      const pageLayout = this.getPageDimensionMax(eachPage);
      let nextPages: Page = new Page();
      nextPages.NumberOfRows = pageLayout[0];
      nextPages.NumberOfCols = pageLayout[1];
      pageLayoutId = pageLayout[2];
      nextPages.ElementIDsList = [];
      let numeroPage = 1;
      let RowMaxPage = 0;
      let pageid = 0;
      const buttonRowMaxPage = this.db.prepare('SELECT * FROM \'ElementPlacement\' INNER JOIN \'ElementReference\' ON ElementReference.Id = ElementPlacement.ElementReferenceId WHERE PageLayoutId == ' + pageLayoutId + ' ORDER BY Id');
      while (buttonRowMaxPage.step()) {
        const gridPosition = buttonRowMaxPage.getAsObject().GridPosition;
        const buttonPosition = gridPosition.split(',');
        const buttonRow = Number(buttonPosition[1]);
        if (RowMaxPage < buttonRow) {
          RowMaxPage = buttonRow;
          pageid = buttonRowMaxPage.getAsObject().PageId;
        }
      }
      if (this.newGrid.PageList[pageid - 4] != null) {
        const numberNewPage = Math.floor(RowMaxPage / this.newGrid.PageList[pageid - 4].NumberOfRows);
        if (numberNewPage > 0) {
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

            // numberNewPage - 1 !== i because we don't want a down button in the last page
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
          }
        }
      }
    }
  }

  /**
   * fill in the rest of the page with the corresponding buttons
   * @param nextPages the page to fill
   * @param indicePage index of the page to be filled
   * @param pageid index of the page in the database
   */
  buttonsNewPages(nextPages: Page, indicePage: number, pageid: number) {
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
      if (this.gridElement.y >= nextPages.NumberOfRows * (indicePage + 1) && this.gridElement.y < nextPages.NumberOfRows * (indicePage + 2) && pageid === buttonPageId) {
        this.newGrid.ElementList.forEach(element => {
          if (element.ID === this.gridElement.ID) {
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
  DeleteDoublon(grid: Grid) {
    grid.PageList.forEach(page => {
      page.ElementIDsList = Array.from(new Set(page.ElementIDsList));
    });
  }

  /**
   * add a colomn if we need to add a button page down and we don't have place to do it
   */
  addColIfNeeded() {
    let isColAdd = false;
    this.newGrid.PageList.forEach(page => {
      let indexGoDownButtonPage = this.newGrid.ElementList.findIndex(element => element.ID.includes('goDown'));
      if(indexGoDownButtonPage > -1){
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
    console.log('pourcentage d\'erreur : ', this.numberErrorImage / this.newGrid.ImageList.length * 100);
  }
}
